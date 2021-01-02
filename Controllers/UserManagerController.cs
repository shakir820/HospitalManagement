using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using HospitalManagement.Data;
using HospitalManagement.Helper;
using HospitalManagement.Models;
using HospitalManagement.Models.ViewModels;
using HospitalManagement.Services;
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
        EmailService _emailService;

        public UserManagerController(
            HospitalManagementDbContext context,
            UserManager<User> userManager,
            RoleManager<UserRole> roleManager,
            SignInManager<User> signInManager,
            IWebHostEnvironment webHostEnvironment,
            EmailService emailService)
        {
            _emailService = emailService;
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
        public async Task<IActionResult> CreateNewUser2(PostMethodRawData post_data)
        {

            using (var transation = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var userModel = JsonConvert.DeserializeObject<UserModel>(post_data.json_data);
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
                                    userModel.id = user.Id;
                                    userModel.roles = new List<string> { userModel.role };
                                    userModel.username = user.UserName;
                                    userModel.approved = false;

                                    
                                    return new JsonResult(new 
                                    {
                                        success = true,
                                        error = false,
                                        user = userModel
                                    });
                                }
                                else
                                {
                                    await transation.RollbackAsync();
                                

                                    return new JsonResult(new 
                                    {
                                        success = false,
                                        error_msg = "Cannot add User role",
                                        error = true,
                                        
                                    });
                                }
                            }
                            else
                            {
                                await transation.RollbackAsync();
                              
                                return new JsonResult(new 
                                {
                                    success = false,
                                    error_msg = "Cannot create User role",
                                    error = true,
                                   
                                });
                            }
                        }
                        else
                        {
                            var roleResult = await _userManager.AddToRoleAsync(user, dbRole.Name);
                            if (roleResult.Succeeded)
                            {
                                await transation.CommitAsync();

                                userModel.id = user.Id;
                                userModel.roles = new List<string> { userModel.role };
                                userModel.username = user.UserName;
                                userModel.approved = false;

                                return new JsonResult(new 
                                {
                                    success = true,
                                    error = false,
                                    user = userModel
                                });
                            }
                            else
                            {
                                await transation.RollbackAsync();
                            
                                return new JsonResult(new 
                                {
                                    success = false,
                                    error_msg = "Cannot add role to User",
                                    error = true,
                                   
                                });
                            }
                        }
                    }
                    else
                    {
                        await transation.RollbackAsync();
                    
                        return new JsonResult(new 
                        {
                            success = false,
                            error = true,
                            error_msg = "Something went wrong"
                        });
                    }
                }
                catch (Exception ex)
                {
                    await transation.RollbackAsync();
                    return new JsonResult(new 
                    {
                        success = false,
                        error = true,
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
                                    roles = roleCollection.ToList(),
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
                                    degree_title = user.DegreeTittle,
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





        [HttpPost]
        public async Task<IActionResult> SigninUser2(UserModel userModel)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(userModel.email);
                if (user != null)
                {
                    var canSignin = await _signInManager.CanSignInAsync(user);
                    if (user.IsActive == false)
                    {
                        canSignin = false;
                    }

                    if (canSignin)
                    {

                        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, userModel.password, false);
                        if (signInResult.Succeeded)
                        {
                            var roleCollection = await _userManager.GetRolesAsync(user);

                            user = await _context.Users.Include(a => a.Languages).Include(a => a.Specialities).Include(a => a.Schedules).
                                AsNoTracking().FirstOrDefaultAsync(a => a.Id == user.Id);

                            var userModel1 = ModelBindingResolver.ResolveUser(user, roleCollection.ToList());

                            //string em_sub = "Login";
                            //string address = "shakir.sha95@gmail.com";
                            //string em_body = "Dear Shakir, \n You have just logged in";

                            //_emailService.SendEmail(em_sub, em_body, new List<string> { address });


                            return new JsonResult(new ViewModels.SignInResult
                            {
                                success = true,
                                user = userModel1
                            });
                        }
                        else
                        {
                            return new JsonResult(new ViewModels.SignInResult
                            {
                                success = false,
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
                            msg = "You cannot login",
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
                            degree_title = user.DegreeTittle,
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



        public async Task<IActionResult> getUserById2(long id)
        {
            try
            {
                var user = await _context.Users.Include(a => a.Languages).Include(a => a.Specialities).Include(a => a.Schedules).AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);
                if (user != null)
                {
                    if(user.IsActive == false)
                    {

                        return new JsonResult(new
                        {
                            success = false,
                            error = false,
                            error_msg = "User is not active"
                        });
                    }

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

                    var usr = ModelBindingResolver.ResolveUser(user, roleCollection);

                    return new JsonResult(new ViewModels.SignInResult
                    {
                        success = true,
                        user = usr

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
                                var emailChangeToken = await _userManager.GenerateChangeEmailTokenAsync(user, userModel.email);
                                await _userManager.ChangeEmailAsync(user, userModel.email, emailChangeToken);
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
                        user.Address = userModel.address;
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
                            user.DegreeTittle = userModel.degree_title;
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
                            roles = userRoles.ToList(),
                            state_name = user.state_name,
                            username = user.UserName,


                            biography = user.Biography,
                            degree_title = user.DegreeTittle,
                            doctor_title = user.DoctorTitle,
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




     

        public async Task<IActionResult> GetUsers(string search_key)
        {

            bool can_search_with_id = false;
            long search_id;
            if(long.TryParse(search_key, out search_id))
            {
                can_search_with_id = true;
            }

            try
            {
                
                
                var roles = await _context.Roles.ToListAsync();

                if(can_search_with_id == true)
                {
                    var db_user = await _context.Users.FirstOrDefaultAsync(a => a.Id == search_id);

                    var users_roles = await _context.UserRoles.Where(a => a.UserId == search_id).ToListAsync();



                    var user_list = new List<UserModel>();
                    var user_role_list = new List<string>();
                    var user_roles_ids = users_roles.Where(a => a.UserId == search_id);
                    foreach (var role_id_item in user_roles_ids)
                    {
                        var role_item = roles.FirstOrDefault(a => a.Id == role_id_item.RoleId);
                        user_role_list.Add(role_item.Name);
                    }
                    user_list.Add(ModelBindingResolver.ResolveUser(db_user, user_role_list));

                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        user_list
                    });
                }
                else
                {
                    var db_users = await  _context.Users.FromSqlRaw("EXECUTE SearchUsers {0}", search_key).ToListAsync();
                    
                    //var db_users = await _context.Users.Where(a => a.Name.IndexOf(search_key) > 0).Take(10).ToListAsync();
                    
                    //var user_ids = db_users.Select(a => a.Id).AsEnumerable();

                    //var users_roles =  _context.UserRoles.AsEnumerable().Join(user_ids, o => o.UserId, i => i, (o, i) => new { u_id = i, u_role = o }).ToList();
                    //user_ids.Join(_context.UserRoles, o => o, i => i.UserId, (o, i) => new {  }).ToList();
                    //var users_roles = await _context.UserRoles.Where(a => user_ids.Contains(a.UserId)).ToListAsync();
                    


                    var user_list = new List<UserModel>();
                    foreach(var user in db_users)
                    {
                        var db_roles = await _userManager.GetRolesAsync(user);
                        //var db_roles = await _context.UserRoles.Join(_context.Roles, o => o.RoleId, i => i.Id, (o, i) => new
                        //{
                        //    user_role = o,
                        //    role = i
                        //}).Where(a => a.user_role.UserId == user.Id).ToListAsync();

                        //var user_role_list =  db_roles.Select(a => a.role.Name).ToList();
                        user_list.Add(ModelBindingResolver.ResolveUser(user, db_roles.ToList()));
                    }


                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        user_list
                    });

                    //var srole = await _context.Roles.Join(_context.UserRoles, o => o.Id, i => i.RoleId, (o, i) => new { role = o, user_role = i }).
                    //    GroupJoin(_context.Users, o => o.user_role.UserId, i => i.Id, (o, i) => new { role = o, users = i.ToList() }).
                    //    FirstOrDefaultAsync(a => a.role.role.Name == "Staff");


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








        [HttpPost]
        public async Task<IActionResult> ChangeRole(UserModel userModel)
        {
            try
            {
                var roles = userModel.roles;
                var user_id = userModel.id;
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == user_id);
                var user_roles = await _userManager.GetRolesAsync(user);

                foreach (var item in roles)
                {
                    if (!user_roles.Contains(item))
                    {
                        var role = await _roleManager.FindByNameAsync(item);
                        if (role == null)
                        {
                            await _roleManager.CreateAsync(new UserRole { Name = item });
                        }
                        await _userManager.AddToRoleAsync(user, item);
                    }
                }

                foreach (var item in user_roles)
                {
                    if (!roles.Contains(item))
                    {
                        await _userManager.RemoveFromRoleAsync(user, item);
                    }
                }

                return new JsonResult(new
                {
                    success = true,
                    error = false
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




        public async Task<IActionResult> GetPatientInfoByDoctor(long doctor_id)
        {
            try
            {
                var p_role = await _context.Roles.AsNoTracking().FirstOrDefaultAsync(a => a.Name == "Patient");
                var total_patient_count = await _context.UserRoles.Where(a => a.RoleId == p_role.Id).CountAsync();
                var patient_served_count = await _context.DoctorAppointments.Where(a => a.DoctorId == doctor_id & a.Consulted == true).CountAsync();

                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    total_patient_count,
                    patient_served_count
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



        public async Task<IActionResult> GetPatientSummaryInfo(long patient_id)
        {
            try
            {
                var total_appointments = await _context.DoctorAppointments.Where(a => a.PatientId == patient_id).CountAsync();
                var total_investigations = await _context.InvestigationDocs.Where(a => a.PatientId == patient_id && a.InvestigationStatus == InvestigationStatus.Completed).CountAsync();
                var total_documents = await _context.PatientDocuments.Where(a => a.PatientId == patient_id).CountAsync();
                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    total_appointments,
                    total_investigations,
                    total_documents
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
        public async Task<IActionResult> ChangePassword( PostMethodRawData post_data)
        {
            try
            {
                var userModel = JsonConvert.DeserializeObject<UserModel>(post_data.json_data);
                var db_user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userModel.id);
                var pass_change_result = await _userManager.ChangePasswordAsync(db_user, userModel.password, userModel.new_password);

                if (pass_change_result.Succeeded)
                {

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
                        error = false,
                        old_password_incorrect = true
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
