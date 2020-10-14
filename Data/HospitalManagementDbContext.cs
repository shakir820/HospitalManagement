using HospitalManagement.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Data
{
  

    public class HospitalManagementDbContext : DbContext
    {
        public HospitalManagementDbContext(DbContextOptions<HospitalManagementDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }


    }
}
