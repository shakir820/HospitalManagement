using HospitalManagement.Data;
using HospitalManagement.Helper;
using HospitalManagement.Models;
using HospitalManagement.Models.ViewModels;
using HospitalManagement.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace HospitalManagement.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class InvestigationController : ControllerBase
    {
        HospitalManagementDbContext _context;
        IWebHostEnvironment _webHostEnvironment;
        EmailService _emailService;

        public InvestigationController(HospitalManagementDbContext context,
            EmailService emailService,
            IWebHostEnvironment webHostEnvironment)
        {
            _emailService = emailService;
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }






        public async Task<IActionResult> GetAllInvestigationsByPatient(long patient_id)
        {

            try
            {
                var invList = await _context.InvestigationDocs.Join(_context.Users, o => o.PatientId, i => i.Id, (o, i) => new { inv = o, patient = i }).
                    Join(_context.Users, o => o.inv.DoctorId, i => i.Id, (o, i) => new { inv_patient = o, doctor = i}).
                    Join(_context.Users, o => o.inv_patient.inv.InvestigatorId, i => i.Id, (o, i) => new { inv_pa_doc = o, investigator = i }).
                    AsNoTracking().Where(a => a.inv_pa_doc.inv_patient.inv.PatientId == patient_id && 
                    a.inv_pa_doc.inv_patient.inv.InvestigationStatus == InvestigationStatus.Completed).ToListAsync();

                var investigations = new List<InvestigationDocModel>();

                foreach(var item in invList)
                {
                    var doc = item.inv_pa_doc.doctor;
                    var pat = item.inv_pa_doc.inv_patient.patient;
                    var invgtr = item.investigator;
                    var doctor = ModelBindingResolver.ResolveUser(doc);
                    var patient = ModelBindingResolver.ResolveUser(pat);
                    var investigator = ModelBindingResolver.ResolveUser(invgtr);
                    var investigation = ModelBindingResolver.ResolveInvestigationDoc(item.inv_pa_doc.inv_patient.inv, doctor, patient, investigator);
                    //investigation.file_location = Url.Content($"~/{MiscellaneousInfo.InvestigationDoc_Link}{investigation.id}");
                    investigation.file_link = Url.Content($"~/{MiscellaneousInfo.InvestigationDoc_Link}{investigation.id}");
                    investigations.Add(investigation);
                }

                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    investigations
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
        }





        public async Task<IActionResult> GetInvestigationFile(long investigation_id)
        {
            var db_inv = await _context.InvestigationDocs.AsNoTracking().FirstOrDefaultAsync(a => a.Id == investigation_id);


            var rootDirectory = _webHostEnvironment.ContentRootPath;
            var stream = new FileStream(Path.Combine(rootDirectory, $"{MiscellaneousInfo.InvestigationDoc_Folder_Path}/{db_inv.FileLocation}"), FileMode.Open, FileAccess.Read, FileShare.Read);
            var file_extension = Path.GetExtension(Path.Combine(rootDirectory, $"{MiscellaneousInfo.InvestigationDoc_Folder_Path}/{db_inv.FileLocation}"));
            var fs = new FileStreamResult(stream, db_inv.ContentType);
            fs.FileDownloadName = $"{db_inv.FileName}";
            return fs;

        }





        public async Task<IActionResult> GetInvestigations(string search_key)
        {
            try
            {
                var sk = search_key.ToUpper();
                var investigations_List = await _context.InvestigationTags.Where(a => a.Abbreviation.ToUpper().Contains(sk)).ToListAsync();

                var investigations = new List<InvestigationTagModel>();

                foreach (var item in investigations_List)
                {
                    var investigation = new InvestigationTagModel();
                    investigation.abbreviation = item.Abbreviation;
                    investigation.id = item.Id;
                    investigation.name = item.Name;

                    investigations.Add(investigation);
                }

                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    investigations
                });
            }
            catch(Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
           
        }






        public async Task<IActionResult> GetAllRequestedInvestigation()
        {
            try
            {
                var bd_int_list = await _context.InvestigationDocs.Join(_context.Users, o => o.PatientId, i => i.Id, (o, i) => new { inv = o, patient = i }).
                    Join(_context.Users, o => o.inv.DoctorId, i => i.Id, (o, i) => new { inv_pa = o, doctor = i }).
                    Where(a => a.inv_pa.inv.InvestigationStatus == InvestigationStatus.Pending).ToListAsync();


                var investigation_list = new List<InvestigationDocModel>();

                foreach(var item in bd_int_list)
                {
                    var investigation = ModelBindingResolver.ResolveInvestigationDoc(item.inv_pa.inv,
                        ModelBindingResolver.ResolveUser(item.doctor),
                        ModelBindingResolver.ResolveUser(item.inv_pa.patient));
                    investigation.file_link = Url.Content($"~/{MiscellaneousInfo.InvestigationDoc_Link}{investigation.id}");
                    investigation_list.Add(investigation);
                }


                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    investigation_list
                });

            }
            catch(Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
        }





        public async Task<IActionResult> GetAllInvestigationAbbreviations()
        {
            try
            {
                var investigations = await _context.InvestigationTags.ToListAsync();
                var investigation_abbreviation_list = new List<string>();
                foreach(var item in investigations)
                {
                    investigation_abbreviation_list.Add(item.Abbreviation);
                }

                investigation_abbreviation_list = investigation_abbreviation_list.OrderBy(a => a).ToList();

                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    investigation_abbreviation_list
                });
            }
            catch(Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
        }







        public async Task<IActionResult> GetInvestigationById(long id)
        {
            try
            {
                var db_inv = await _context.InvestigationDocs.Join(_context.Users, o => o.PatientId, i => i.Id, (o, i) => new { inv = o, patient = i }).
                    AsNoTracking().FirstOrDefaultAsync(a => a.inv.Id == id);


                if(db_inv == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = "Investigation not found"
                    });
                }


                var db_investigator = await _context.Users.AsNoTracking().FirstOrDefaultAsync(a => a.Id == db_inv.inv.InvestigatorId);
                var db_doctor = await _context.Users.Include(a => a.Specialities).AsNoTracking().FirstOrDefaultAsync(a => a.Id == db_inv.inv.DoctorId);

                var doctor = ModelBindingResolver.ResolveUser(db_doctor);
                var investigator = ModelBindingResolver.ResolveUser(db_investigator);
                var patient = ModelBindingResolver.ResolveUser(db_inv.patient);
                var investigation = ModelBindingResolver.ResolveInvestigationDoc(db_inv.inv, doctor, patient, investigator);
                investigation.file_link = Url.Content($"~/{MiscellaneousInfo.InvestigationDoc_Link}{id}");


                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    investigation
                });
            }
            catch(Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
        }




        [HttpPost]
        public async Task<IActionResult> AssignInvestigationToInvestigator(PostMethodRawData post_data)
        {
            using(var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var investigation = JsonConvert.DeserializeObject<InvestigationDocModel>(post_data.json_data);
                    //throw new Exception();
                   
                    var db_inve = await _context.InvestigationDocs.FirstOrDefaultAsync(a => a.Id == investigation.id);
                    if (db_inve == null)
                    {
                        return new JsonResult(new
                        {
                            success = false,
                            error = true,
                            error_msg = "Investigation not found"
                        });
                    }

                    var db_investigator = await _context.Users.FirstOrDefaultAsync(a => a.Id == investigation.investigator.id);
                    if (db_investigator == null)
                    {
                        return new JsonResult(new
                        {
                            success = false,
                            error = true,
                            error_msg = "Investigator not found"
                        });
                    }


                    db_inve.InvestigatorId = db_investigator.Id;
                    db_inve.InvestigationStatus = InvestigationStatus.Inprogress;

                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();


                    return new JsonResult(new
                    {
                        success = true,
                        error = false
                    });
                }
                catch(Exception ex)
                {
                    await transaction.RollbackAsync();

                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = ex.Message
                    });
                }
                
            }
        }




        public async Task<IActionResult> GetInvestigationSummaryByInvestigator(long investigator_id)
        {
            try
            {
                var total_investigations = await _context.InvestigationDocs.CountAsync();
                var pending_investigations = await _context.InvestigationDocs.Where(a => a.InvestigationStatus == InvestigationStatus.Pending).CountAsync();
                var completed_investigations = await _context.InvestigationDocs.Where(a => a.InvestigationStatus == InvestigationStatus.Completed && 
                a.InvestigatorId == investigator_id).CountAsync();


                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    total_investigations,
                    pending_investigations,
                    completed_investigations
                });

            
            }
            catch(Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
        }






        public async Task<IActionResult> GetAllAssignedInvestigations(long investigator_id)
        {
            try
            {
                var db_inv_doc_pa = await _context.InvestigationDocs.Join(_context.Users, o => o.DoctorId, i => i.Id, (o, i) => new
                {
                    inv = o,
                    doc = i
                }).Join(_context.Users, o => o.inv.PatientId, i => i.Id, (o, i) => new 
                { 
                    inv_doc = o,
                    patient = i
                }).Where(a => a.inv_doc.inv.InvestigatorId == investigator_id).ToListAsync();

                var investigation_list = new List<InvestigationDocModel>();

                foreach (var item in db_inv_doc_pa)
                {
                    var db_inv = item.inv_doc.inv;
                    var db_pa = item.patient;
                    var db_doc = item.inv_doc.doc;
                    var investigation =  ModelBindingResolver.ResolveInvestigationDoc(db_inv, ModelBindingResolver.ResolveUser(db_doc), ModelBindingResolver.ResolveUser(db_pa));
                    investigation.file_link = Url.Content($"~/{MiscellaneousInfo.InvestigationDoc_Link}{investigation.id}");
                    investigation_list.Add(investigation);
                }


                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    investigation_list
                });
            }
            catch(Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
        }






        [HttpPost]
        public async Task<IActionResult> UnassignInvestigation(InvestigationDocModel investigation)
        {
            try
            {
                var db_inv = await _context.InvestigationDocs.FirstOrDefaultAsync(a => a.Id == investigation.id);
                db_inv.InvestigationStatus = InvestigationStatus.Pending;
                db_inv.InvestigatorId = default;
                await _context.SaveChangesAsync();

                return new JsonResult(new
                {
                    success = true,
                    error = false
                });

            }
            catch(Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
        }





        [HttpPost]
        public async Task<IActionResult> UploadInvestigationFile([FromForm] InvestigationDocModel investigation)
        {
            using(var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                  
                    var today = DateTime.Now;
                    var db_inv = await _context.InvestigationDocs.FirstOrDefaultAsync(a => a.Id == investigation.id);

                    if (db_inv == null)
                    {
                        return new JsonResult(new
                        {
                            success = false,
                            error = true,
                            error_msg = "Investigation not found"
                        });
                    }

                    var rootDirectory = _webHostEnvironment.ContentRootPath;

                    var folder_path = Path.Combine(rootDirectory, $"{MiscellaneousInfo.InvestigationDoc_Folder_Path}/{db_inv.PatientId}");
                    if (!Directory.Exists(folder_path))
                    {
                        Directory.CreateDirectory(folder_path);
                    }

                    using (var stream = new FileStream(folder_path + $"/{investigation.investigation_file.FileName}", FileMode.Create, FileAccess.Write, FileShare.Write))
                    {
                        await investigation.investigation_file.CopyToAsync(stream);
                    }

                    db_inv.FileLocation = $"{db_inv.PatientId}/{investigation.investigation_file.FileName}";
                    db_inv.InvestigationStatus = InvestigationStatus.Completed;
                    db_inv.FileName = investigation.investigation_file.FileName;
                    db_inv.ContentType = investigation.investigation_file.ContentType;
                    db_inv.SampleSubmitDate = today;
                    db_inv.ResultPublishDate = today;

                    await _context.SaveChangesAsync();


                    var db_doc = await _context.Users.FirstOrDefaultAsync(a => a.Id == db_inv.DoctorId);
                    var db_patient = await _context.Users.FirstOrDefaultAsync(a => a.Id == db_inv.PatientId);
                    var db_investigator = await _context.Users.FirstOrDefaultAsync(a => a.Id == db_inv.InvestigatorId);
                    investigation = ModelBindingResolver.ResolveInvestigationDoc(db_inv, ModelBindingResolver.ResolveUser(db_doc),
                        ModelBindingResolver.ResolveUser(db_patient), ModelBindingResolver.ResolveUser(db_investigator));

                    investigation.file_link = Url.Content($"~/{MiscellaneousInfo.InvestigationDoc_Link}{db_inv.Id}");

                    await transaction.CommitAsync();


                    string em_sub = "Investigation or LAB Test";
                    string address = "shakir.sha95@gmail.com";
                    string em_body = $"Dear {db_patient.Name}, \n Your {db_inv.Abbreviation} lab test or investigation file has been uploaded. " +
                        $"You can now check the file from your account";

                    _emailService.SendEmailAsync(em_sub, em_body, new List<string> { address });

                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        investigation
                    });
                }
                catch(Exception ex)
                {
                    await transaction.RollbackAsync();
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = ex.Message
                    });
                }

            }
        }








        [HttpPost]
        public async Task<IActionResult> DeleteInvestigaitonDocument(InvestigationDocModel inv)
        {
            using(var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var db_inv = await _context.InvestigationDocs.FirstOrDefaultAsync(a => a.Id == inv.id);

                    if(db_inv == null)
                    {
                        
                        return new JsonResult(new
                        {
                            success = false,
                            error = true,
                            error_msg = "Investigation not found"
                        });
                    }


                    if(db_inv.InvestigationStatus == InvestigationStatus.Completed)
                    {
                        var rootDirectory = _webHostEnvironment.ContentRootPath;
                        var file_path = Path.Combine(rootDirectory, $"{MiscellaneousInfo.InvestigationDoc_Folder_Path}/{db_inv.FileLocation}");

                        if (System.IO.File.Exists(file_path))
                        {
                            System.IO.File.Delete(file_path);
                        }

                        
                    }

                    db_inv.FileLocation = null;
                    db_inv.ContentType = null;
                    db_inv.FileName = null;
                    db_inv.InvestigatorId = default;
                    db_inv.ResultPublishDate = default;
                    db_inv.SampleSubmitDate = default;
                    db_inv.InvestigationStatus = InvestigationStatus.Pending;

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return new JsonResult(new
                    {
                        success = true,
                        error = false
                    });

                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = ex.Message
                    });
                }
            }
            
        }



    }
}
