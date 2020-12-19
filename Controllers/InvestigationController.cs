using HospitalManagement.Data;
using HospitalManagement.Helper;
using HospitalManagement.Models;
using HospitalManagement.Models.ViewModels;
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


        public InvestigationController(HospitalManagementDbContext context, IWebHostEnvironment webHostEnvironment)
        {
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
                    AsNoTracking().Where(a => a.inv_pa_doc.inv_patient.inv.PatientId == patient_id).ToListAsync();

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
                    investigation.file_location = Url.Content($"~/{MiscellaneousInfo.InvestigationDoc_Link}{investigation.id}");

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





        public IActionResult GetInvestigationFile(long investigation_id)
        {
            
            var rootDirectory = _webHostEnvironment.ContentRootPath;
            var stream = new FileStream(Path.Combine(rootDirectory, "FileData/Advanced Organic Chemistry Structure & Mechanisms.pdf"), FileMode.Open, FileAccess.Read, FileShare.Read);
            //var stream = Path.Combine(rootDirectory, "FileData/Advanced Organic Chemistry Structure & Mechanisms.pdf");    
            //var investigationData = await System.IO.File.(Path.Combine(rootDirectory, "FileData/Advanced Organic Chemistry Structure & Mechanisms.pdf"));
            return new FileStreamResult(stream, "application/pdf");

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
                    investigation.file_location = Url.Content($"~/{MiscellaneousInfo.InvestigationDoc_Link}{investigation.id}");
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
                    Thread.Sleep(3000);
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
    }
}
