using HospitalManagement.Data;
using HospitalManagement.Helper;
using HospitalManagement.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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







        [HttpPost]
        public async Task<IActionResult> CreateStaff(UserModel user)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var today = DateTime.Now;
                    var staff_user = new User();
                    staff_user.Approved = false;
                    staff_user.CreatedDate = today;
                    staff_user.EmailConfirmed = true;
                    staff_user.IsActive = true;
                    staff_user.Name = user.name;
                    staff_user.UserName = user.username;
                    staff_user.Age = user.age;
                    staff_user.Gender = user.gender;
                    


                    var create_result = await _userManager.CreateAsync(staff_user, user.password);
                    if (create_result.Succeeded)
                    {
                        var staffRole = await _roleManager.FindByNameAsync("Staff");
                        if (staffRole == null)
                        {
                            staffRole = new UserRole();
                            staffRole.Name = "Staff";
                            await _roleManager.CreateAsync(staffRole);
                        }


                        foreach (var item in user.roles)
                        {
                            var _role = await _roleManager.FindByNameAsync(item);
                            if (_role == null)
                            {
                                _role = new UserRole();
                                _role.Name = item;
                                await _roleManager.CreateAsync(_role);
                            }
                        }

                        var role_added_result = await _userManager.AddToRolesAsync(staff_user, user.roles);

                        if (role_added_result.Succeeded)
                        {
                            await transaction.CommitAsync();
                            user = ModelBindingResolver.ResolveUser(staff_user, user.roles);
                            return new JsonResult(new
                            {
                                success = true,
                                error = false,
                                user
                            });
                        }
                        else
                        {
                            return new JsonResult(new
                            {
                                success = false,
                                error = true,
                                error_msg = "Cannot add role"
                            });
                        }
                    }
                    else
                    {
                        return new JsonResult(new
                        {
                            success = false,
                            error = true,
                            error_msg = "User cannot create"
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
                        error_msg = ex.Message
                    });
                }
            }
        }













        [HttpPost]
        public async Task<IActionResult> Login(UserModel userModel)
        {
            try
            {
               
                if (userModel.username != null)
                {
                    var claimsIdentity = new ClaimsIdentity();
                    claimsIdentity.AddClaim(new Claim( "UserName", userModel.username));
                    var claimPrincipals = new ClaimsPrincipal(claimsIdentity);
                    var db_user = await _userManager.GetUserAsync(claimPrincipals);
                    if(db_user == null)
                    {
                        return new JsonResult(new
                        {
                            success = false,
                            error = true,
                            error_msg = "User doesn't exist"
                        });
                    }
                    var isStaff = await _userManager.IsInRoleAsync(db_user, "Staff");

                    if(isStaff == false)
                    {
                        return new JsonResult(new
                        {
                            success = false,
                            error = true,
                            error_msg = "User is not staff"
                        });
                    }



                    var signInResult = await _signInManager.PasswordSignInAsync(userModel.username, userModel.password, true, false);
                    if (signInResult.Succeeded)
                    {
                        var role_collection = await _userManager.GetRolesAsync(db_user);
                        var user = ModelBindingResolver.ResolveUser(db_user, role_collection.ToList());
                            return new JsonResult(new
                            {
                                success = true,
                                error = false,
                                user
                            });
                       
                    }
                    else
                    {
                        return new JsonResult(new
                        {
                            error = true,
                            success = false,
                            error_msg = "Wrong Password"
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
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    error = true,
                    success = false,
                    error_msg = ex.Message
                });
            }
        }














        public async Task<IActionResult> GetAllStaffList()
        {

            try
            {
                var sr = await  _context.Roles.FirstOrDefaultAsync(a => a.Name == "Staff");
                if(sr == null)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        staff_list = new List<UserModel>()
                    });
                }
                var sui_list = await _context.UserRoles.Where(a => a.RoleId == sr.Id).ToListAsync();

                var staff_list = new List<UserModel>();
                foreach (var item in sui_list)
                {
                    var roles_queryable = _context.UserRoles.Join(_context.Roles, outter => outter.RoleId, inner => inner.Id, (o, i) => new { user_role = o, role = i });
                    var su = await _context.Users.GroupJoin(roles_queryable, o => o.Id, i => i.user_role.UserId, (o, i) => new
                    {
                        user = o,
                        roles = i
                    }).FirstOrDefaultAsync(a => a.user.Id == item.UserId);

                    var rc = su.roles.Select(a => a.role.Name).ToList();
                    staff_list.Add(ModelBindingResolver.ResolveUser(su.user, rc));
                }
                
                //var staff_users_roles_queryable = _context.Users.GroupJoin(_context.UserRoles, outter => outter.Id, inner => inner.UserId, (outter, inner) => new
                //{
                //    user = outter,
                //    user_roles = inner.AsQueryable()
                //}).AsQueryable();

                //var staff_users = await staff_users_roles_queryable.Where(a => a.user_roles.FirstOrDefault(a => a.RoleId == sr.Id) != null).ToListAsync();

                //var roles_queryable = _context.UserRoles.Join(_context.Roles, outter => outter.RoleId, inner => inner.Id, (o, i) => new { user_role = o, role = i });
                //var urq = _context.Users.GroupJoin(roles_queryable, o => o.Id, i => i.user_role.UserId, (o, i) => new { user = o, roles = i }).AsQueryable();
                //var su = await urq.AsNoTracking().Where(a => a.roles.FirstOrDefault(a => a.role.Name == "Staff") != null).ToListAsync();


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
    }
}
