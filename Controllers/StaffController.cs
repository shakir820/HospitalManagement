using HospitalManagement.Data;
using HospitalManagement.Helper;
using HospitalManagement.Models;
using HospitalManagement.Models.ViewModels;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HospitalManagement.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        HospitalManagementDbContext _context;
        UserManager<User> _userManager;
        RoleManager<UserRole> _roleManager;
        SignInManager<User> _signInManager;
        IWebHostEnvironment _webHostEnvironment;


        public StaffController(
            HospitalManagementDbContext context,
            UserManager<User> userManager,
            RoleManager<UserRole> roleManager,
            SignInManager<User> signInManager,
            IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _webHostEnvironment = webHostEnvironment;
        }






















        public async Task<IActionResult> GetAllStaffList()
        {

            try
            {

                var all_role = await _context.Roles.ToListAsync();
                var staff_role = await  _context.Roles.FirstOrDefaultAsync(a => a.Name == "Staff");
                
                if (staff_role == null)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        staff_list = new List<UserModel>()
                    });
                }

                var staff_user_role_ids = await _context.UserRoles.Where(a => a.RoleId == staff_role.Id).ToListAsync();

              
                var staff_list = new List<UserModel>();
                foreach (var item in staff_user_role_ids)
                {
                    var db_user = await _context.Users.FirstOrDefaultAsync(a => a.Id == item.UserId);
                    var db_user_roles = await _context.UserRoles.Where(a => a.UserId == db_user.Id).ToListAsync();
                    var user_roles = new List<string>();
                    foreach(var role_item in db_user_roles)
                    {
                        var db_user_role = all_role.FirstOrDefault(a => a.Id == role_item.RoleId);
                        user_roles.Add(db_user_role.Name);
                    }

                    var user = ModelBindingResolver.ResolveUser(db_user, user_roles);
                    staff_list.Add(user);
                }
               


                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    staff_list
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








        public IActionResult GetStaffRoles()
        {
            var staff_roles = new List<string>();
            staff_roles.Add("Investigator");
            staff_roles.Add("All");
            return new JsonResult(new
            {
                success = true,
                error = false,
                staff_roles
            });
        }








       
    }
}
