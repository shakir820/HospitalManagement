using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using HospitalManagement.Data;
using HospitalManagement.Models;
using HospitalManagement.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.V3.Pages.Internal.Account;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace HospitalManagement.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserManagerController : ControllerBase
    {
        HospitalManagementDbContext _context;
        UserManager<User> _userManager;
        RoleManager<UserRole> _roleManager;
        SignInManager<User> _signInManager;
        IWebHostEnvironment _webHostEnvironment;


        public UserManagerController(
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
        public async Task<IActionResult> CreateNewUserAsync(UserModel userModel)
        {

            using (var transation = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var user = new User();
                    user.Email = userModel.email;
                    user.Name = userModel.name;
                    user.Age = userModel.age;
                    user.Gender = userModel.gender;
                    user.UserName = userModel.email;
                    var result = await _userManager.CreateAsync(user, userModel.password);
                    if (result.Succeeded)
                    {
                        var dbRole = await _roleManager.FindByNameAsync(userModel.role);
                        if (dbRole == null)
                        {
                            var newRole = new UserRole { Name = userModel.role };
                            var roleCreatedResult = await _roleManager.CreateAsync(newRole);
                            if (roleCreatedResult.Succeeded)
                            {
                                var roleResult = await _userManager.AddToRoleAsync(user, newRole.Name);
                                if (roleResult.Succeeded)
                                {
                                    await transation.CommitAsync();
                                    return new JsonResult(new UserCreateResult
                                    {
                                        success = true,
                                        user_id = user.Id,
                                        user_age = userModel.age ?? 0,
                                        user_gender = userModel.gender,
                                        role_list = new List<string> { userModel.role },
                                        user_name = user.Name,
                                        username = user.UserName,
                                        approved = false
                                    });
                                }
                                else
                                {
                                    await transation.RollbackAsync();
                                    //var roleErrorList = new List<string>();
                                    //foreach (var item in roleResult.Errors)
                                    //{
                                    //    roleErrorList.Add(item.Description);
                                    //}

                                    return new JsonResult(new UserCreateResult
                                    {
                                        success = false,
                                        error_msg = "Cannot add User role",
                                        //user_id = user.Id,
                                        //user_name = user.Name,
                                        //username = user.UserName,
                                        error = true,
                                        //error_list = roleErrorList
                                    });
                                }
                            }
                            else
                            {
                                await transation.RollbackAsync();
                                //var roleErrorList = new List<string>();
                                //foreach (var item in roleCreatedResult.Errors)
                                //{
                                //    roleErrorList.Add(item.Description);
                                //}

                                return new JsonResult(new UserCreateResult
                                {
                                    success = false,
                                    error_msg = "Cannot create User role",
                                    //user_id = user.Id,
                                    //user_name = user.Name,
                                    //username = user.UserName,
                                    error = true,
                                    //error_list = roleErrorList
                                });
                            }
                        }
                        else
                        {
                            var roleResult = await _userManager.AddToRoleAsync(user, dbRole.Name);
                            if (roleResult.Succeeded)
                            {
                                await transation.CommitAsync();
                                return new JsonResult(new UserCreateResult
                                {
                                    success = true,
                                    user_id = user.Id,
                                    user_name = user.Name,
                                    username = user.UserName,
                                    error = false,
                                    role_list = new List<string> { userModel.role }
                                });
                            }
                            else
                            {
                                await transation.RollbackAsync();
                                //var roleErrorList = new List<string>();
                                //foreach (var item in roleResult.Errors)
                                //{
                                //    roleErrorList.Add(item.Description);
                                //}

                                return new JsonResult(new UserCreateResult
                                {
                                    success = false,
                                    error_msg = "Cannot add role to User",
                                    //username = user.UserName,
                                    //user_id = user.Id,
                                    error = true,
                                    //error_list = roleErrorList
                                });
                            }
                        }
                    }
                    else
                    {
                        await transation.RollbackAsync();
                        //var errorList = new List<string>();
                        //var errorCollection = result.Errors;
                        //foreach (var errorItem in errorCollection)
                        //{
                        //    errorList.Add(errorItem.Description);
                        //}
                        return new JsonResult(new UserCreateResult
                        {
                            success = false,
                            error = true,
                            //error_list = errorList,
                            error_msg = "Something went wrong"
                        });
                    }
                }
                catch (Exception ex)
                {
                    await transation.RollbackAsync();
                    return new JsonResult(new UserCreateResult
                    {
                        success = false,
                        error = true,
                        //error_list = errorList,
                        error_msg = "Something went wrong"
                    });
                }
            }

        }





        [HttpPost]
        public async Task<IActionResult> SigninUserAsync(UserModel userModel)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(userModel.email);
                if (user != null)
                {
                    var canSignin = await _signInManager.CanSignInAsync(user);

                    if (canSignin)
                    {

                        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, userModel.password, false);
                        if (signInResult.Succeeded)
                        {
                            var roleCollection = await _userManager.GetRolesAsync(user);

                            user = await _context.Users.Include(a => a.Languages).Include(a => a.Specialities).Include(a => a.Schedules).
                                AsNoTracking().FirstOrDefaultAsync(a => a.Id == user.Id);

                            var language_List = new List<LanguageTagModel>();
                            foreach (var item in user.Languages)
                            {
                                var language = new LanguageTagModel { id = item.LanguageId, languageName = item.LanguageName };
                                language_List.Add(language);
                            }

                            var speciality_List = new List<SpecialityTagModel>();
                            foreach (var item in user.Specialities)
                            {
                                var speciality = new SpecialityTagModel { id = item.SpecialityTagId, specialityName = item.SpecialityName };
                                speciality_List.Add(speciality);
                            }

                            var schedule_list = new List<ScheduleModel>();
                            foreach (var item in user.Schedules)
                            {
                                var schedule = new ScheduleModel { day_name = item.DayName, end_time = item.EndTime, start_time = item.StartTime, id = item.Id };
                                schedule_list.Add(schedule);
                            }

                            return new JsonResult(new ViewModels.SignInResult
                            {
                                success = true,
                                user = new UserModel
                                {
                                    id = user.Id,
                                    age = user.Age,
                                    email = user.Email,
                                    gender = user.Gender,
                                    name = user.Name,
                                    roles = roleCollection,
                                    username = user.UserName,
                                    bloodGroup = user.BloodGroup,
                                    bmdc_certifcate = user.BMDC_certifcate,
                                    city_name = user.city_name,
                                    country_name = user.country_name,
                                    country_phone_code = user.country_phone_code,
                                    country_short_name = user.country_short_name,
                                    state_name = user.state_name,
                                    phoneNumber = user.PhoneNumber,
                                    approved = user.Approved,

                                    biography = user.Biography,
                                    degree_tittle = user.DegreeTittle,
                                    doctor_title = user.DoctorTitle,
                                    experience = user.year_of_Experience,
                                    languages = language_List,
                                    new_patient_visiting_price = user.NewPatientVisitingPrice,
                                    old_patient_visiting_price = user.OldPatientVisitingPrice,
                                    schedules = schedule_list,
                                    specialities = speciality_List,
                                    types_of = user.TypesOf

                                }

                            });
                        }
                        else
                        {
                            return new JsonResult(new ViewModels.SignInResult
                            {
                                success = false,
                                user = new UserModel
                                {
                                    id = user.Id,
                                    age = user.Age,
                                    email = user.Email,
                                    gender = user.Gender,
                                    name = user.Name,
                                    username = user.UserName
                                },
                                wrong_password = true,
                                error = false,
                                msg = "Password is wrong"

                            });
                        }

                    }
                    else
                    {
                        return new JsonResult(new ViewModels.SignInResult
                        {
                            success = false,
                            msg = "User cannot signin",
                            error = false
                        });
                    }
                }
                else
                {
                    return new JsonResult(new ViewModels.SignInResult
                    {
                        success = false,
                        msg = "Email doesn't exist",
                        error = false,
                        emailExist = false
                    });
                }


            }
            catch (Exception ex)
            {
                return new JsonResult(new ViewModels.SignInResult
                {
                    error_msg = ex.Message,
                    error = true,
                    success = false
                });
            }
        }







        public async Task<IActionResult> getUserById(long id)
        {
            try
            {
                var user = await _context.Users.Include(a => a.Languages).Include(a => a.Specialities).Include(a =>a.Schedules).AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);
                if (user != null)
                {
                    var userRoleIds = await _context.UserRoles.Where(a => a.UserId == user.Id).ToListAsync();
                    var roleCollection = new List<string>();
                    foreach (var identityRole in userRoleIds)
                    {
                        var user_role = await _context.Roles.FirstOrDefaultAsync(a => a.Id == identityRole.RoleId);
                        if (user_role != null)
                        {
                            roleCollection.Add(user_role.Name);
                        }
                    }

                    var language_List = new List<LanguageTagModel>();
                    foreach(var item in user.Languages)
                    {
                        var language = new LanguageTagModel { id = item.LanguageId, languageName = item.LanguageName };
                        language_List.Add(language);
                    }

                    var speciality_List = new List<SpecialityTagModel>();
                    foreach (var item in user.Specialities)
                    {
                        var speciality = new SpecialityTagModel { id = item.SpecialityTagId, specialityName = item.SpecialityName };
                        speciality_List.Add(speciality);
                    }

                    var schedule_list = new List<ScheduleModel>();
                    foreach(var item in user.Schedules)
                    {
                        var schedule = new ScheduleModel { day_name = item.DayName, end_time = item.EndTime, start_time = item.StartTime, id = item.Id };
                        schedule_list.Add(schedule);
                    }

                    return new JsonResult(new ViewModels.SignInResult
                    {
                        success = true,
                        user = new UserModel
                        {
                            age = user.Age,
                            email = user.Email,
                            gender = user.Gender,
                            name = user.Name,
                            roles = roleCollection,
                            username = user.UserName,
                            id = user.Id,
                            bloodGroup = user.BloodGroup,
                            bmdc_certifcate = user.BMDC_certifcate,
                            city_name = user.city_name,
                            country_name = user.country_name,
                            country_phone_code = user.country_phone_code,
                            country_short_name = user.country_short_name,
                            state_name = user.state_name,
                            phoneNumber = user.PhoneNumber,
                            
                            approved = user.Approved,
                            biography = user.Biography,
                            degree_tittle = user.DegreeTittle,
                            doctor_title = user.DoctorTitle,
                            experience = user.year_of_Experience,
                            languages = language_List,
                            new_patient_visiting_price = user.NewPatientVisitingPrice,
                            old_patient_visiting_price = user.OldPatientVisitingPrice,
                            schedules = schedule_list,
                            specialities = speciality_List,
                            types_of = user.TypesOf
                        }

                    });
                }
                else
                {
                    return new JsonResult(new ViewModels.SignInResult
                    {
                        success = false,
                        msg = "User doesn't exist",
                        error = false
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new ViewModels.SignInResult
                {
                    error_msg = ex.Message,
                    error = true,
                    success = false
                });
            }
        }






        public async Task<IActionResult> CheckForUniqueUsername(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            //var user = await _context.Users.FirstOrDefaultAsync(a => a.NormalizedUserName == normalizedUsername);
            if (user == null)
            {
                return new JsonResult(new
                {
                    unique_username = true
                });
            }
            else
            {
                return new JsonResult(new
                {
                    unique_username = false
                });
            }
        }


        public async Task<IActionResult> GetProfilePic(long id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(a => a.Id == id);
            if (user != null)
            {
                if (user.ProfilePic != null && user.ProfilePic.Length > 0)
                {
                    return File(user.ProfilePic, "image/jpeg");
                }
                var rootDirectory = _webHostEnvironment.ContentRootPath;
                var imageData = System.IO.File.ReadAllBytes(Path.Combine(rootDirectory, "Resources/default-avatar.png"));
                return File(imageData, "image/jpeg");
            }
            else
            {
                return null;
            }
        }


        [HttpPost]
        public async Task<IActionResult> UpdateProfileData([FromForm] UserModel userModel)
        {
           
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var user = await _context.Users.Include(a=>a.Schedules).Include(a=>a.Languages).Include(a=>a.Specialities).FirstOrDefaultAsync(a => a.Id == userModel.id);
                    if (user != null)
                    {


                        if (userModel.email != null)
                        {
                            if (user.Email != userModel.email)
                            {
                                await _userManager.ChangeEmailAsync(user, userModel.email, null);
                            }
                        }

                        user.Age = userModel.age;
                        user.BloodGroup = userModel.bloodGroup;
                        user.city_name = userModel.city_name;

                        if(userModel.role == "Doctor")
                        {
                            if (userModel.bmdc_certifcate != null)
                            {
                                if (user.BMDC_certifcate != userModel.bmdc_certifcate)
                                {
                                    user.BMDC_certifcate = userModel.bmdc_certifcate;
                                    user.Approved = false;
                                }
                            }
                        }
                     
                        

                       
                        user.country_name = userModel.country_name;
                        user.country_phone_code = userModel.country_phone_code;
                        user.country_short_name = userModel.country_short_name;
                        user.Gender = userModel.gender;
                        user.EmailConfirmed = true;
                        user.Name = userModel.name;
                        user.PhoneNumber = userModel.phoneNumber;
                       
                        user.PhoneNumberConfirmed = true;


                        if (userModel.profilePic != null)
                        {
                            using (var memoryStream = new MemoryStream())
                            {
                                await userModel.profilePic.CopyToAsync(memoryStream);
                                user.ProfilePic = memoryStream.ToArray();
                            }
                        }



                        user.state_name = userModel.state_name;
                        user.city_name = userModel.city_name;

                        if(userModel.username != null)
                        {
                            if (user.UserName != userModel.username)
                            {
                                await _userManager.SetUserNameAsync(user, userModel.username);
                               
                            }
                        }

                        if(userModel.role == "Doctor")
                        {
                            user.Biography = userModel.biography;
                            user.DegreeTittle = userModel.degree_tittle;
                            user.DoctorTitle = userModel.doctor_title;

                            if (!string.IsNullOrEmpty(userModel.languages_json))
                            {
                                user.Languages.Clear();
                                await _context.SaveChangesAsync();

                                userModel.languages = JsonConvert.DeserializeObject<List<LanguageTagModel>>(userModel.languages_json);
                                foreach (var item in userModel.languages)
                                {
                                    var lang = new SelectedLanguage { LanguageId = item.id, LanguageName = item.languageName };
                                    user.Languages.Add(lang);
                                    await _context.SaveChangesAsync();
                                }
                            }
                            user.NewPatientVisitingPrice = userModel.new_patient_visiting_price;
                            user.OldPatientVisitingPrice = userModel.old_patient_visiting_price;

                            if (!string.IsNullOrEmpty(userModel.schedules_json))
                            {
                                userModel.schedules = JsonConvert.DeserializeObject<List<ScheduleModel>>(userModel.schedules_json);
                                user.Schedules.Clear();
                                await _context.SaveChangesAsync();
                                foreach(var item in userModel.schedules)
                                {
                                    var schedule = new Schedule { DayName = item.day_name, EndTime = item.end_time, StartTime = item.start_time };
                                    user.Schedules.Add(schedule);
                                    await _context.SaveChangesAsync();
                                }
                            }

                            if (!string.IsNullOrEmpty(userModel.specialities_json))
                            {
                                user.Specialities.Clear();
                                await _context.SaveChangesAsync();
                                userModel.specialities = JsonConvert.DeserializeObject<List<SpecialityTagModel>>(userModel.specialities_json);

                                foreach(var item in userModel.specialities)
                                {
                                    var speciality = new SelectedSpecialityTag { SpecialityTagId = item.id, SpecialityName = item.specialityName };
                                    user.Specialities.Add(speciality);
                                    await _context.SaveChangesAsync();
                                }
                            }


                            user.TypesOf = userModel.types_of;
                            user.year_of_Experience = userModel.experience;

                        }





                        await _context.SaveChangesAsync();



                        bool roleAdded = false;
                        var user_roles = await _userManager.GetRolesAsync(user);
                        if (!user_roles.Contains(userModel.role))
                        {
                            var role_exist = await _roleManager.RoleExistsAsync(userModel.role);
                            if (role_exist == false)
                            {
                                var new_role = new UserRole { Name = userModel.role };
                                var role_create_result = await _roleManager.CreateAsync(new_role);

                                if (role_create_result.Succeeded)
                                {
                                    var role_remove_result = await _userManager.RemoveFromRolesAsync(user, user_roles);
                                    if (role_remove_result.Succeeded)
                                    {
                                        var role_added_result = await _userManager.AddToRoleAsync(user, userModel.role);
                                        if (role_added_result.Succeeded)
                                        {
                                            roleAdded = true;
                                        }
                                        else
                                        {
                                            roleAdded = false;
                                        }
                                    }
                                    else
                                    {
                                        roleAdded = false;
                                    }
                                }
                                else
                                {
                                    roleAdded = false;
                                }
                            }
                            else
                            {
                                var role_remove_result = await _userManager.RemoveFromRolesAsync(user, user_roles);
                                if (role_remove_result.Succeeded)
                                {
                                    var role_added_result = await _userManager.AddToRoleAsync(user, userModel.role);
                                    if (role_added_result.Succeeded)
                                    {
                                        roleAdded = true;
                                    }
                                    else
                                    {
                                        roleAdded = false;
                                    }
                                }
                                else
                                {
                                    roleAdded = false;
                                }
                            }
                        }
                        else
                        {
                            roleAdded = true;
                        }

                        await transaction.CommitAsync();

                        var userRoles = await _userManager.GetRolesAsync(user);
                        //user = await _context.Users.Include(a => a.Schedules).FirstOrDefaultAsync(a => a.Id == userModel.id);
                        var schedule_list = new List<ScheduleModel>();
                        foreach(var item in user.Schedules)
                        {
                            var shcedule = new ScheduleModel { id = item.Id, day_name = item.DayName, end_time = item.EndTime, start_time = item.StartTime };
                            schedule_list.Add(shcedule);
                        }

                        var userResult = new UserModel
                        {
                            age = user.Age,
                            approved = user.Approved,
                            bloodGroup = user.BloodGroup,
                            bmdc_certifcate = user.BMDC_certifcate,
                            city_name = user.city_name,
                            country_name = user.country_name,
                            country_phone_code = user.country_phone_code,
                            country_short_name = user.country_short_name,
                            email = user.Email,
                            gender = user.Gender,
                            id = user.Id,
                            name = user.Name,
                            phoneNumber = user.PhoneNumber,
                            roles = userRoles,
                            state_name = user.state_name,
                            username = user.UserName,


                            biography = user.Biography,
                            degree_tittle = user.DegreeTittle,
                            doctor_title = user.DegreeTittle,
                            experience = user.year_of_Experience,
                            languages = userModel.languages,
                            new_patient_visiting_price = user.NewPatientVisitingPrice,
                            old_patient_visiting_price = user.OldPatientVisitingPrice,
                            schedules = schedule_list,
                            specialities = userModel.specialities,
                            types_of = user.TypesOf
                        };

                        return new JsonResult(new
                        {
                            success = true,
                            error = false,
                            role_added = roleAdded,
                            user = userResult
                        });


                    }
                    else
                    {
                        return new JsonResult(new
                        {
                            success = false,
                            error = true,
                            error_msg = "User not found!"
                        });
                    }
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        role_added = false,
                        error_msg = ex.Message
                    });
                }
            }
        }





        public async Task<IActionResult> GetSpecialityTags()
        {
            try
            {
                var all_speciality_tags = await _context.Specialities.AsNoTracking().ToListAsync();
                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    specialities = all_speciality_tags
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



        public async Task<IActionResult> GetLanguages()
        {
            try
            {
                var all_languages = await _context.Languages.AsNoTracking().ToListAsync();
                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    languages = all_languages
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
