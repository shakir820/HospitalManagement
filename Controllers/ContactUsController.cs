using HospitalManagement.Data;
using HospitalManagement.Models;
using HospitalManagement.Models.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ContactUsController : ControllerBase
    {
        HospitalManagementDbContext _context;
      

        public ContactUsController( HospitalManagementDbContext context )
        {
            _context = context;
           
        }


        [HttpPost]
        public async Task<IActionResult> SendContactUsMessage(ContactUsMessageModel messageModel)
        {
            using (var transation = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var msg = new ContactMessage();
                    msg.CustomerName = messageModel.customer_name;
                    msg.Email = messageModel.email;
                    msg.Message = messageModel.message;
                    msg.Mobile = messageModel.mobile;

                    _context.ContactMessages.Add(msg);
                    await _context.SaveChangesAsync();
                    await transation.CommitAsync();

                    return new JsonResult(new
                    {
                        success = true,
                        error = false
                    });
                }
                catch(Exception ex)
                {
                    await transation.RollbackAsync();
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
