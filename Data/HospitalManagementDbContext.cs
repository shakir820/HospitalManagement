using HospitalManagement.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Data
{
  

    public class HospitalManagementDbContext :IdentityDbContext<User, UserRole, long>
    {
        public HospitalManagementDbContext(DbContextOptions<HospitalManagementDbContext> options)
            : base(options)
        {
            
        }

        public DbSet<Language> Languages { get; set; }
        public DbSet<SelectedLanguage> SelectedLanguages { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Speciality> Specialities { get; set; }
        public DbSet<SelectedSpecialityTag> SelectedSpecialityTags { get; set; }
        public DbSet<DoctorAppointment> DoctorAppointments { get; set; }

    }
}
