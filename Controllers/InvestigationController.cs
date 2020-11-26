using HospitalManagement.Data;
using HospitalManagement.Models.ViewModels;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
                var invList = await _context.InvestigationDocs.AsNoTracking().Where(a => a.PatientId == patient_id).ToListAsync();

                var investigations = new List<InvestigationDocModel>();



                for (var i = 1; i < 21; i++)
                {
                    var inv = new InvestigationDocModel();
                    if(i < 10)
                    {
                        inv.abbreviation = "GOLD";
                    }
                    else
                    {
                        inv.abbreviation = "SILVER";
                    }
                    
                    inv.created_date = DateTime.Now;
                    inv.doctor_id = i + 10;
                    inv.file_location = "I don't know yet";
                    inv.file_name = "Lorem Imsum";
                    inv.id = i;
                    inv.investigation_tag_id = i + 2;
                    inv.investigator_id = i + 3;
                    inv.name = "Lorem Ipsum";
                    inv.patient_id = 5;
                    inv.prescription_id = i + 4;

                    investigations.Add(inv);
                }

                //foreach ( var item in invList)
                //{
                //    var inv = new InvestigationDocModel();
                //    inv.abbreviation = item.Abbreviation;
                //    inv.created_date = item.CreatedDate;
                //    inv.doctor_id = item.DoctorId;
                //    inv.file_location = item.FileLocation;
                //    inv.file_name = item.FileName;
                //    inv.id = item.Id;
                //    inv.investigation_tag_id = item.InvestigationTagId;
                //    inv.investigator_id = item.InvestigatorId;
                //    inv.name = item.Name;
                //    inv.patient_id = item.PatientId;
                //    inv.prescription_id = item.PrescriptionId;


                //    investigations.Add(inv);
                //}


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
                var investigations_List = await _context.InvestigationTags.Where(a => a.Abbreviation.
                IndexOf(search_key, StringComparison.OrdinalIgnoreCase) >= 0).Take(20).ToListAsync();

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
    }
}
