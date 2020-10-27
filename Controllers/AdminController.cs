using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HospitalManagement.Data;
using HospitalManagement.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        HospitalManagementDbContext _context;
        UserManager<User> _userManager;
        RoleManager<UserRole> _roleManager;
        SignInManager<User> _signInManager;
        IWebHostEnvironment _webHostEnvironment;


        public AdminController(
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




        [HttpPost]
        public async Task<IActionResult> Login(UserModel userModel)
        {
            try
            {
                //check for any admin user
                var userList = await _userManager.GetUsersInRoleAsync("Admin");
                if(userList.Count == 0)
                {
                    var ok_done = await CreateDefaultAdminUser();

                    if(ok_done == false)
                    {
                        return new JsonResult(new
                        {
                            success = false,
                            error = true,
                            error_msg = "Couldn't create default admin"
                        });
                    }
                }
                if(userModel.username != null)
                {
                    var signInResult = await _signInManager.PasswordSignInAsync(userModel.username, userModel.password, true, false);
                    if (signInResult.Succeeded)
                    {
                        var user = await _userManager.GetUserAsync(User);
                        if(user != null)
                        {
                            var role_collection = await _userManager.GetRolesAsync(user);
                            return new JsonResult(new
                            {
                                success = true,
                                error = false,
                                user = new UserModel
                                {
                                    age = user.Age,
                                    bloodGroup = user.BloodGroup,
                                    bmdc_certifcate = user.BMDC_certifcate,
                                    city_name = user.city_name,
                                    country_name = user.country_name,
                                    country_phone_code = user.country_phone_code,
                                    country_short_name = user.country_short_name,
                                    email = user.Email,
                                    gender = user.Gender,
                                    approved = user.Approved,
                                    id = user.Id,
                                    name = user.Name,
                                    roles = role_collection,
                                    phoneNumber = user.PhoneNumber,
                                    state_name = user.state_name,
                                    username = user.UserName
                                }
                            });
                        }
                        else
                        {
                            return new JsonResult(new
                            {
                                error = true,
                                success = false,
                                error_msg = "User doesn't exist"
                            });
                        }
                    }
                    else
                    {
                        return new JsonResult(new
                        {
                            error = true,
                            success = false,
                            error_msg = "Login failed"
                        });
                    }
                }
                else
                {
                    return new JsonResult(new
                    {
                        error = true,
                        success = false,
                        error_msg = "Parameters are not provided"
                    });
                }
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





        private async Task<bool> CreateDefaultAdminUser()
        {
            var adminRole = await _roleManager.FindByNameAsync("Admin");
            if(adminRole == null)
            {
                var role_create_result = await _roleManager.CreateAsync(new UserRole { Name = "Admin" });
                if(role_create_result.Succeeded == false)
                {
                    return false;
                }
            }
            var newAdminUser = new User();
            newAdminUser.Age = 18;
            newAdminUser.Email = "admin@gmail.com";
            newAdminUser.EmailConfirmed = true;
            newAdminUser.Gender = "Male";
            newAdminUser.Name = "Admin";
            newAdminUser.UserName = "Admin";
            newAdminUser.Approved = true;
            var createAdminResult = await _userManager.CreateAsync(newAdminUser, "admin1234");
            if (createAdminResult.Succeeded)
            {
                var role_added_result = await _userManager.AddToRoleAsync(newAdminUser, "Admin");
                if (role_added_result.Succeeded)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }






        public async Task<IActionResult> GetUnapprovedDoctors()
        {
            try
            {
                //var my_custom_query_doctors = await _context.Users.Join(_context.UserRoles, outter => outter.Id, inner => inner.UserId, (users, roles) => 
                //new { doctors = users, roles = roles }).Join(_context.Roles, outter => outter.roles.RoleId, inner => inner.Id, (outter, inner) => 
                //new { doctors_roles = outter, roles = inner }).Where(a => a.roles.Name == "Doctor" && a.doctors_roles.doctors.Approved == false).
                //Select(a => a.doctors_roles.doctors).ToListAsync();


                var doctors = await _userManager.GetUsersInRoleAsync("Doctor");
                var unApprovedDoctors = doctors.Where(a => a.Approved != true).ToList();
                var listOfDoctors = new List<UserModel>();

                foreach (var item in unApprovedDoctors)
                {
                    var doctor = new UserModel();
                    doctor.age = item.Age;
                    doctor.approved = false;
                    doctor.bloodGroup = item.BloodGroup;
                    doctor.bmdc_certifcate = item.BMDC_certifcate;
                    doctor.city_name = item.city_name;
                    doctor.country_name = item.country_name;
                    doctor.country_phone_code = item.country_phone_code;
                    doctor.country_short_name = item.country_short_name;
                    doctor.email = item.Email;
                    doctor.gender = item.Gender;
                    doctor.id = item.Id;
                    doctor.name = item.Name;
                    doctor.phoneNumber = item.PhoneNumber;
                    doctor.roles = new List<string> { "Doctor" };
                    doctor.state_name = item.state_name;
                    doctor.username = item.UserName;
                    listOfDoctors.Add(doctor);
                }

                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    doctor_list = listOfDoctors
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
