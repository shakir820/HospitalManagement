using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HospitalManagement.Data;
using HospitalManagement.Helper;
using HospitalManagement.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
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
                                    roles = role_collection.ToList(),
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




        public async Task<IActionResult> GetAllDoctorList()
        {
            try
            {

                var doctors = await _userManager.GetUsersInRoleAsync("Doctor");
     
                var listOfDoctors = new List<UserModel>();

                foreach (var item in doctors)
                {
                    var doctor = new UserModel();
                    doctor.age = item.Age;
                    doctor.approved = item.Approved;
                    doctor.bloodGroup = item.BloodGroup;
                    doctor.bmdc_certifcate = item.BMDC_certifcate;
                    doctor.city_name = item.city_name;
                    doctor.country_name = item.country_name;
                    doctor.country_phone_code = item.country_phone_code;
                    doctor.country_short_name = item.country_short_name;
                    doctor.email = item.Email;
                    doctor.gender = item.Gender;
                    doctor.isActive = item.IsActive;
                    doctor.id = item.Id;
                    doctor.name = item.Name;
                    doctor.phoneNumber = item.PhoneNumber;
                    doctor.roles = new List<string> { "Doctor" };
                    doctor.state_name = item.state_name;
                    doctor.username = item.UserName;
                    doctor.biography = item.Biography;
                    doctor.degree_title = item.DegreeTittle;
                    doctor.doctor_title = item.DoctorTitle;
                    doctor.experience = item.year_of_Experience;
                    doctor.new_patient_visiting_price = item.NewPatientVisitingPrice;
                    doctor.old_patient_visiting_price = item.OldPatientVisitingPrice;
                    doctor.types_of = item.TypesOf;
                    
                    listOfDoctors.Add(doctor);
                }

                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    doctor_list = listOfDoctors
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




       
        public async Task<IActionResult> ApproveDoctor(long  id)
        {
            try
            {
                var doctor = await _context.Users.FirstOrDefaultAsync(a => a.Id == id);
                if (doctor != null)
                {
                    doctor.Approved = true;
                    await _context.SaveChangesAsync();
                    return new JsonResult(new
                    {
                        success = true,
                        error = false
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = "Doctor not found"
                    });
                }
            }
            catch(Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = "Something went wrong"
                });
            }

        }



      
        public async Task<IActionResult> UnapproveDoctor(long id)
        {
            try
            {
                var doctor = await _context.Users.FirstOrDefaultAsync(a => a.Id == id);
                if (doctor != null)
                {
                    doctor.Approved = false;
                    await _context.SaveChangesAsync();
                    return new JsonResult(new
                    {
                        success = true,
                        error = false
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = "Doctor not found"
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = "Something went wrong"
                });
            }

        }




       
        public async Task<IActionResult> ActivateUser(long id)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == id);
                if (user != null)
                {
                    user.IsActive = true;
                    await _context.SaveChangesAsync();
                    return new JsonResult(new
                    {
                        success = true,
                        error = false
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = "User not found"
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = "Something went wrong"
                });
            }

        }


       
        public async Task<IActionResult> DeactivateUser(long id)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == id);
                if (user != null)
                {
                    user.IsActive = false;
                    await _context.SaveChangesAsync();
                    return new JsonResult(new
                    {
                        success = true,
                        error = false
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = "User not found"
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = "Something went wrong"
                });
            }

        }





        public async Task<IActionResult> GetDoctor(long id)
        {
            try
            {
                var user = await _context.Users.Include(a => a.Specialities).Include(a => a.Languages).Include(a=>a.Schedules).AsNoTracking().
                    FirstOrDefaultAsync(a => a.Id == id);
                if(user != null)
                {
                    var _doctor = new UserModel();
                    _doctor.age = user.Age;
                    _doctor.approved = user.Approved;
                    _doctor.biography = user.Biography;
                    _doctor.bloodGroup = user.BloodGroup;
                    _doctor.bmdc_certifcate = user.BMDC_certifcate;
                    _doctor.city_name = user.city_name;
                    _doctor.country_name = user.country_name;
                    _doctor.country_phone_code = user.country_phone_code;
                    _doctor.country_short_name = user.country_short_name;
                    _doctor.degree_title = user.DegreeTittle;
                    _doctor.doctor_title = user.DoctorTitle;
                    _doctor.email = user.Email;
                    _doctor.experience = user.year_of_Experience;
                    _doctor.gender = user.Gender;
                    _doctor.id = user.Id;
                    _doctor.isActive = user.IsActive;
                    _doctor.languages = new List<LanguageTagModel>();
                    foreach (var item in user.Languages)
                    {
                        var lang = new LanguageTagModel
                        {
                            id = item.LanguageId,
                            languageName = item.LanguageName
                        };
                        _doctor.languages.Add(lang);
                    }

                    _doctor.name = user.Name;
                    _doctor.new_patient_visiting_price = user.NewPatientVisitingPrice;
                    _doctor.old_patient_visiting_price = user.OldPatientVisitingPrice;
                    _doctor.phoneNumber = user.PhoneNumber;
                    _doctor.roles = new List<string> { "Doctor" };
                    _doctor.schedules = new List<ScheduleModel>();
                    foreach(var item in user.Schedules)
                    {
                        var schedule = new ScheduleModel();
                        schedule.day_name = item.DayName;
                        schedule.end_time = item.EndTime;
                        schedule.id = item.Id;
                        schedule.start_time = item.StartTime;
                        _doctor.schedules.Add(schedule);
                    }
                    _doctor.specialities = new List<SpecialityTagModel>();
                    foreach(var item in user.Specialities)
                    {
                        var speciality = new SpecialityTagModel
                        {
                            id = item.SpecialityTagId,
                            specialityName = item.SpecialityName
                        };
                        _doctor.specialities.Add(speciality);
                    }
                    _doctor.state_name = user.state_name;
                    _doctor.types_of = user.TypesOf;
                    _doctor.username = user.UserName;


                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        doctor = _doctor
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = "Doctor not found"
                    });
                }
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
