using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HospitalManagement.Data;
using HospitalManagement.Helper;
using HospitalManagement.Models;
using HospitalManagement.Models.ViewModels;
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
                            var um = ModelBindingResolver.ResolveUser(user, role_collection.ToList());
                            return new JsonResult(new
                            {
                                success = true,
                                error = false,
                                user = um
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
                            wrong_password = true,
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
            newAdminUser.CreatedDate = DateTime.Now;
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
                    doctor.created_date = item.CreatedDate;
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
                    doctor.created_date = item.CreatedDate;
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
                    _doctor.created_date = user.CreatedDate;
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









        public async Task<IActionResult> GetAdminSummary()
        {
            try
            {
                long total_patient = 0;
                long total_doctor = 0;
                long total_staff = 0;
                long total_pending_doctor = 0;
                int total_pending_investigation = 0;
                int total_completed_investigation = 0;
                int total_inprogress_investigation = 0;

                var today = DateTime.Now;
                var this_month = new DateTime(today.Year, today.Month, today.Day);


                var patient_role = await _context.Roles.FirstOrDefaultAsync(a => a.Name == "Patient");
                if (patient_role != null)
                {
                    total_patient = await  _context.UserRoles.Where(a => a.RoleId == patient_role.Id).CountAsync();
                }

                var doctor_role = await _context.Roles.FirstOrDefaultAsync(a => a.Name == "Doctor");

                if(doctor_role != null)
                {
                    total_doctor = await _context.UserRoles.Where(a => a.RoleId == doctor_role.Id).CountAsync();
                    total_pending_doctor = await _context.Users.Join(_context.UserRoles, o => o.Id, i => i.UserId, (o, i) => new 
                    { 
                        user = o, 
                        user_role = i 
                    }).Where(a => a.user_role.RoleId == doctor_role.Id && a.user.Approved == false).CountAsync();
                }

                var staff_role = await _context.Roles.FirstOrDefaultAsync(a => a.Name == "Staff");

                if(staff_role != null)
                {
                    total_staff = await _context.UserRoles.Where(a => a.RoleId == staff_role.Id).CountAsync();
                }

                total_completed_investigation = await _context.InvestigationDocs.Where(a => a.InvestigationStatus == InvestigationStatus.Completed && a.CreatedDate >= this_month).CountAsync();
                total_inprogress_investigation = await _context.InvestigationDocs.Where(a => a.InvestigationStatus == InvestigationStatus.Inprogress && a.CreatedDate >= this_month).CountAsync();
                total_pending_investigation = await _context.InvestigationDocs.Where(a => a.InvestigationStatus == InvestigationStatus.Pending && a.CreatedDate >= this_month).CountAsync();



                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    total_completed_investigation,
                    total_inprogress_investigation,
                    total_pending_investigation,
                    total_pending_doctor,
                    total_patient,
                    total_doctor,
                    total_staff
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
        public async Task<IActionResult> UpdateAdminProfile([FromForm] UserModel admin_user)
        {
            using(var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var db_user = await _context.Users.FirstOrDefaultAsync(a => a.Id == admin_user.id);

                    if(db_user == null)
                    {
                        return new JsonResult(new
                        {
                            success = false,
                            error = true,
                            error_msg = "Admin user not found"
                        });
                    }

                    if (admin_user.username != null)
                    {
                        if (db_user.UserName != admin_user.username)
                        {
                            db_user.UserName = admin_user.username;
                        }
                    }


                    if (admin_user.profilePic != null)
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            await admin_user.profilePic.CopyToAsync(memoryStream);
                            db_user.ProfilePic = memoryStream.ToArray();
                        }
                    }



                    db_user.Name = admin_user.name;

                    await _userManager.UpdateAsync(db_user);

                    await transaction.CommitAsync();

                    admin_user = ModelBindingResolver.ResolveUser(db_user);

                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        user = admin_user
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









        public async Task<IActionResult> GetUserDetails(long user_id)
        {
            try
            {
                var db_user = await _context.Users.Include(a => a.Specialities).Include(a => a.Languages).
                    Include(a => a.Schedules).AsNoTracking().FirstOrDefaultAsync(a => a.Id == user_id);
                var db_user_roles = await _context.UserRoles.Join(_context.Roles, o => o.RoleId, i => i.Id, (o, i) => new
                {
                    user_role = o,
                    role = i
                }).AsNoTracking().Where(a => a.user_role.UserId == user_id).ToListAsync();

                var roles = new List<string>();
                foreach(var item in db_user_roles)
                {
                    roles.Add(item.role.Name);
                }

                var user =  ModelBindingResolver.ResolveUser(db_user, roles);


                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    user
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



        public async Task<IActionResult> GetDoctorAppointmentList(string selected_date, long doctor_id)
        {
            try
            {
                DateTime sd = DateTime.Parse(selected_date);
                var db_app = await _context.DoctorAppointments.Join(_context.Users, o => o.PatientId, i => i.Id, (o, i) => new 
                {
                    app = o,
                    patient = i
                }).Where(a => a.app.AppointmentDate.Date == sd.Date && 
                a.app.DoctorId == doctor_id).ToListAsync();
                var today = DateTime.Now;

                var appointments = new List<DoctorAppointmentModel>();

                foreach (var item in db_app)
                {
                    if (item.app.AppointmentDate.Date <= today.Date)
                    {
                        if(item.app.Consulted == true)
                        {
                            var doc_app = ModelBindingResolver.ResovleAppointment(item.app);
                            appointments.Add(doc_app);
                        }
                    }
                    else
                    {
                        var doc_app = ModelBindingResolver.ResovleAppointment(item.app);
                        appointments.Add(doc_app);
                    }
                }


                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    appointments
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
