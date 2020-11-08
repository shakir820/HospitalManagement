using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HospitalManagement.Data;
using HospitalManagement.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.V3.Pages.Internal.Account.Manage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {

        HospitalManagementDbContext _context;
        UserManager<User> _userManager;
        RoleManager<UserRole> _roleManager;
        SignInManager<User> _signInManager;
        IWebHostEnvironment _webHostEnvironment;


        public AppointmentController(
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




        public async Task<IActionResult> GeAvailableAppointmentDates(long doctor_id)
        {
            try
            {
                var doctor = await _context.Users.Include(a => a.Schedules).AsNoTracking().FirstOrDefaultAsync(a => a.Id == doctor_id && a.Approved == true && a.IsActive == true);

                if (doctor != null)
                {
                    var today = DateTime.Now; //today is Sunday
                    var doctor_appointments = await _context.DoctorAppointments.AsNoTracking().Where(a => a.DoctorId == doctor_id).ToListAsync();
                    var doctor_schedules = doctor.Schedules;

                    var availableDates = new List<DateTime>();
                    var unavailableDates = new List<DateTime>();
                    for (var i = 0; i < 30; i++)
                    {
                        var specific_date = today.AddDays(i);
                        foreach (var item in doctor_schedules)
                        {
                            if (item.DayName == specific_date.DayOfWeek)
                            {
                                var total_appointments = doctor_appointments.Where(a => a.AppointmentDate.Date == specific_date.Date).ToList();
                                var duration = item.EndTime - item.StartTime;
                                var max_appointments = Math.Floor(duration.TotalMinutes / Helper.MiscellaneousInfo.ConsultDoctorTimeDurationInMins);
                                if (total_appointments.Count < max_appointments)
                                {
                                    availableDates.Add(specific_date.Date);
                                }
                                else
                                {
                                    unavailableDates.Add(specific_date.Date);
                                }
                            }
                            else
                            {
                                unavailableDates.Add(specific_date.Date);
                            }
                        }
                    }

                    var schedules = new List<ScheduleModel>();
                    foreach(var item in doctor_schedules)
                    {
                        var schedule = new ScheduleModel
                        {
                            day_name = item.DayName,
                            end_time = item.EndTime,
                            id = item.Id,
                            start_time = item.StartTime
                        };
                        schedules.Add(schedule);
                    }

                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        available_dates = availableDates,
                        unavailable_dates = unavailableDates,
                        schedules
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






        public async Task<IActionResult> GetAllDoctorList()
        {
            try
            {
                var doctors_list = await _context.Users.Include(a => a.Specialities).Join(_context.UserRoles, outter => outter.Id, inner => inner.UserId, 
                    (outter, inner) => new { doctors = outter, roles = inner }).Join(_context.Roles, outter => outter.roles.RoleId, inner => inner.Id, (outter, inner) => new
                    { doct_role = outter, role_collection = inner}).Where(a => a.role_collection.Name == "Doctor" && a.doct_role.doctors.Approved == true && 
                    a.doct_role.doctors.IsActive == true).ToListAsync();
                
                var listOfDoctors = new List<UserModel>();

                foreach (var item in doctors_list)
                {
                    var doctor = new UserModel();
                    doctor.age = item.doct_role.doctors.Age;
                    doctor.approved = item.doct_role.doctors.Approved;
                    doctor.bloodGroup = item.doct_role.doctors.BloodGroup;
                    doctor.bmdc_certifcate = item.doct_role.doctors.BMDC_certifcate;
                    doctor.city_name = item.doct_role.doctors.city_name;
                    doctor.country_name = item.doct_role.doctors.country_name;
                    doctor.country_phone_code = item.doct_role.doctors.country_phone_code;
                    doctor.country_short_name = item.doct_role.doctors.country_short_name;
                    doctor.email = item.doct_role.doctors.Email;
                    doctor.gender = item.doct_role.doctors.Gender;
                    doctor.isActive = item.doct_role.doctors.IsActive;
                    doctor.id = item.doct_role.doctors.Id;
                    doctor.name = item.doct_role.doctors.Name;
                    doctor.phoneNumber = item.doct_role.doctors.PhoneNumber;
                    doctor.roles = new List<string> { "Doctor" };
                    doctor.state_name = item.doct_role.doctors.state_name;
                    doctor.username = item.doct_role.doctors.UserName;
                    doctor.biography = item.doct_role.doctors.Biography;
                    doctor.degree_title = item.doct_role.doctors.DegreeTittle;
                    doctor.doctor_title = item.doct_role.doctors.DoctorTitle;
                    doctor.experience = item.doct_role.doctors.year_of_Experience;
                    doctor.new_patient_visiting_price = item.doct_role.doctors.NewPatientVisitingPrice;
                    doctor.old_patient_visiting_price = item.doct_role.doctors.OldPatientVisitingPrice;
                    doctor.types_of = item.doct_role.doctors.TypesOf;
                    doctor.specialities = new List<SpecialityTagModel>();

                    foreach(var splt_item in item.doct_role.doctors.Specialities)
                    {
                        var speciality = new SpecialityTagModel
                        {
                            id = splt_item.SpecialityTagId,
                            specialityName = splt_item.SpecialityName
                        };
                        doctor.specialities.Add(speciality);
                    }

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

    }
}
