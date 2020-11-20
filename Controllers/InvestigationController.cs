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





        public async Task<IActionResult> GetInvestigationFile(long investigation_id)
        {
            var rootDirectory = _webHostEnvironment.ContentRootPath;
            var investigationData = await System.IO.File.ReadAllBytesAsync(Path.Combine(rootDirectory, "FileData/Advanced Organic Chemistry Structure & Mechanisms.pdf"));
            return File(investigationData, "application/pdf");

        }
    }
}
