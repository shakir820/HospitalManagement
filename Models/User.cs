using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class User:IdentityUser<long>
    {
        public string Name { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }
       
    }
}
