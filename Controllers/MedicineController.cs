using HospitalManagement.Data;
using HospitalManagement.Models.ViewModels;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MedicineController : ControllerBase
    {
        HospitalManagementDbContext _context;
        IWebHostEnvironment _webHostEnvironment;


        public MedicineController(HospitalManagementDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }






        public async Task<IActionResult> GetMedicines(string search_key)
        {
            try
            {
                var sk = search_key.ToUpper();
                var medicine_list = await _context.Medicines.Where(a => a.Name.ToUpper().Contains(sk)).ToListAsync();

                var medicines = new List<MedicineModel>();

                foreach (var item in medicine_list)
                {
                    var medicine = new MedicineModel();
                    medicine.description = item.Description;
                    medicine.id = item.Id;
                    medicine.medicine_link = item.MedicineLink;
                    medicine.name = item.Name;
                    
                    medicines.Add(medicine);
                }

                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    medicines
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
