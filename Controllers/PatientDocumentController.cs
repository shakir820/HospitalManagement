using HospitalManagement.Data;
using HospitalManagement.Helper;
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
using System.Net.Mime;
using System.Threading.Tasks;

namespace HospitalManagement.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PatientDocumentController : ControllerBase
    {
        HospitalManagementDbContext _context;
        IWebHostEnvironment _webHostEnvironment;


        public PatientDocumentController(HospitalManagementDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }




        public async Task<IActionResult> GetAllDocumentsByPatient(long patient_id)
        {
            try
            {
                var db_doc_list = await _context.PatientDocuments.AsNoTracking().Where(a => a.PatientId == patient_id).ToListAsync();
                var patient = await _context.Users.FirstOrDefaultAsync(a => a.Id == patient_id);

                var document_list = new List<PatientDocumentModel>();

                foreach(var item in db_doc_list)
                {
                    var pd = ModelBindingResolver.ResolvePatientDocument(item);
                    pd.document_link = Url.Content($"~/{MiscellaneousInfo.PatientDoc_Link}{pd.id}");
                    pd.patient = ModelBindingResolver.ResolveUser(patient);
                    document_list.Add(pd);
                }



                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    document_list
                });
            }
            catch(Exception ex)
            {
                return new JsonResult(new
                {
                    error = true,
                    success = false,
                    error_msg = ex.Message
                });
            }
        }





        public async Task<IActionResult> GetPatientDocumentFile(long document_id)
        {
            try
            {
                var db_pd = await _context.PatientDocuments.FirstOrDefaultAsync(a => a.Id == document_id);
                var rootDirectory = _webHostEnvironment.ContentRootPath;
                var stream = new FileStream(Path.Combine(rootDirectory, $"{MiscellaneousInfo.PatientDoc_Folder_Path}/{db_pd.DocumentLocation}"), FileMode.Open, FileAccess.Read, FileShare.Read);
                var file_extension = Path.GetExtension(Path.Combine(rootDirectory, $"{MiscellaneousInfo.PatientDoc_Folder_Path}/{db_pd.DocumentLocation}"));
                var fs = new FileStreamResult(stream, db_pd.ContentType);
                fs.FileDownloadName = $"{db_pd.Name}.{file_extension}";
                return fs;
                
            }
            catch(Exception ex)
            {
                return new JsonResult(new
                {
                    error = true,
                    success = false,
                    error_msg = ex.Message
                });
            }
        }





        [HttpPost]
        public async Task<IActionResult> CreatePatientDocument([FromForm]PatientDocumentModel pdc)
        {
            using(var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var today = DateTime.Now;
                    var db_pd = new PatientDocument();
                   
                    db_pd.ContentType = pdc.document.ContentType;
                    db_pd.CreatedDate = today;
                    db_pd.Name = pdc.name;
                    db_pd.PatientId = pdc.patient_id;
                    var rootDirectory = _webHostEnvironment.ContentRootPath;

                    var folder_path = Path.Combine(rootDirectory, $"{MiscellaneousInfo.PatientDoc_Folder_Path}/{pdc.patient_id}");
                    if(!Directory.Exists(folder_path))
                    {
                        Directory.CreateDirectory(folder_path);
                    }
                    //var file_id = Guid.NewGuid();
                    using (var stream = new FileStream(folder_path + $"/{pdc.document.FileName}", FileMode.Create, FileAccess.Write, FileShare.Write))
                    {
                        await pdc.document.CopyToAsync(stream);
                    }

                    db_pd.DocumentLocation = $"{pdc.patient_id}/{pdc.document.FileName}";

                    _context.PatientDocuments.Add(db_pd);
                    await _context.SaveChangesAsync();


                    var patient_document = ModelBindingResolver.ResolvePatientDocument(db_pd);
                    var db_patient = await _context.Users.FirstOrDefaultAsync(p => p.Id == pdc.patient_id);
                    patient_document.patient = ModelBindingResolver.ResolveUser(db_patient);
                    patient_document.document_link = Url.Content($"~/{MiscellaneousInfo.PatientDoc_Link}{db_pd.Id}");

                    await transaction.CommitAsync();

                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        patient_document
                    });

                }
                catch(Exception ex)
                {
                    await transaction.RollbackAsync();
                    return new JsonResult(new
                    {
                        error = true,
                        success = false,
                        error_msg = ex.Message
                    });
                }
            }
        }











        public async Task<IActionResult> DeletePatientDocument(long document_id)
        {
            try
            {
                var db_doc = await _context.PatientDocuments.FirstOrDefaultAsync(a => a.Id == document_id);

                if (db_doc == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = "Document is not found"
                    });
                }
                var rootDirectory = _webHostEnvironment.ContentRootPath;
                var file_path = Path.Combine(rootDirectory, $"{MiscellaneousInfo.PatientDoc_Folder_Path}/{db_doc.DocumentLocation}");

                if (System.IO.File.Exists(file_path))
                {
                    System.IO.File.Delete(file_path);
                }

                _context.PatientDocuments.Remove(db_doc);
                await _context.SaveChangesAsync();


                return new JsonResult(new
                {
                    success = true,
                    error = false
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









    }
}
