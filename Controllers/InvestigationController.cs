using HospitalManagement.Data;
using HospitalManagement.Helper;
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




    }
}
