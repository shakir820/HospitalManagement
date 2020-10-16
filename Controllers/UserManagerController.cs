using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HospitalManagement.Data;
using HospitalManagement.Models;
using HospitalManagement.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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

        public UserManagerController(
            HospitalManagementDbContext context,
            UserManager<User> userManager, 
            RoleManager<UserRole> roleManager,
            SignInManager<User> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
        }
       



     
        [HttpPost]
        public async Task<IActionResult> CreateNewUserAsync(UserModel userModel)
        {
            try
            {
                var user = new User();
                user.Email = userModel.Email;
                user.Name = userModel.Name;
                user.Age = userModel.Age;
                user.Gender = userModel.Gender;
                user.UserName = userModel.Email;

                var result = await _userManager.CreateAsync(user, userModel.Password);
                if (result.Succeeded)
                {
                    var dbRole = await _roleManager.FindByNameAsync(userModel.Role);
                    if(dbRole == null)
                    {
                        var newRole = new UserRole { Name = userModel.Role };
                        var roleCreatedResult = await _roleManager.CreateAsync(newRole);
                        if (roleCreatedResult.Succeeded)
                        {
                            var roleResult = await _userManager.AddToRoleAsync(user, newRole.Name);
                            if (roleResult.Succeeded)
                            {
                                return new JsonResult(new UserCreateResult
                                {
                                    success = true,
                                    user_id = user.Id,
                                    user_age = userModel.Age,
                                    user_gender = userModel.Gender,
                                    role_list = new List<string> { userModel.Role },
                                    user_name = user.Name
                                });
                            }
                            else
                            {
                                var roleErrorList = new List<string>();
                                foreach (var item in roleResult.Errors)
                                {
                                    roleErrorList.Add(item.Description);
                                }

                                return new JsonResult(new UserCreateResult
                                {
                                    success = false,
                                    error_msg = "Cannot add User role",
                                    user_id = user.Id,
                                    user_name = user.Name,
                                    error = true,
                                    error_list = roleErrorList
                                });
                            }
                        }
                        else
                        {
                            var roleErrorList = new List<string>();
                            foreach (var item in roleCreatedResult.Errors)
                            {
                                roleErrorList.Add(item.Description);
                            }

                            return new JsonResult(new UserCreateResult
                            {
                                success = false,
                                error_msg = "Cannot create User role",
                                user_id = user.Id,
                                user_name = user.Name,
                                error = true,
                                error_list = roleErrorList
                            });
                        }
                    }
                    else
                    {
                        var roleResult = await _userManager.AddToRoleAsync(user, dbRole.Name);
                        if (roleResult.Succeeded)
                        {
                            return new JsonResult(new UserCreateResult
                            {
                                success = true,
                                user_id = user.Id,
                                user_name = user.Name,
                                error = false
                            });
                        }
                        else
                        {
                            var roleErrorList = new List<string>();
                            foreach (var item in roleResult.Errors)
                            {
                                roleErrorList.Add(item.Description);
                            }

                            return new JsonResult(new UserCreateResult
                            {
                                success = false,
                                error_msg = "Cannot add role to User",
                                user_id = user.Id,
                                error = true,
                                error_list = roleErrorList
                            });
                        }
                    }
                }
                else
                {
                    var errorList = new List<string>();
                    var errorCollection = result.Errors;
                    foreach (var errorItem in errorCollection)
                    {
                        errorList.Add(errorItem.Description);
                    }
                    return new JsonResult(new UserCreateResult
                    {
                        success = false,
                        error = true,
                        error_list = errorList
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new UserCreateResult
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
            
        }





        [HttpPost]
        public async Task<IActionResult> SigninUserAsync(UserModel userModel)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(userModel.Email);
                if(user != null)
                {
                    var canSignin = await _signInManager.CanSignInAsync(user);

                    if (canSignin)
                    {
                        await _signInManager.SignInAsync(user, true);
                        var roleCollection = await _userManager.GetRolesAsync(user);

                        return new JsonResult(new ViewModels.SignInResult
                        {
                            success = true,
                            user = new UserModel
                            {
                                Age = user.Age,
                                Email = user.Email,
                                Gender = user.Gender,
                                Name = user.Name,
                                Roles = roleCollection,
                                Username = user.UserName
                            }
                            
                        });
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
            catch(Exception ex)
            {
                return new JsonResult(new ViewModels.SignInResult
                {
                    error_msg = ex.Message,
                    error = true,
                    success = false
                });
            }
        }









    }
}
