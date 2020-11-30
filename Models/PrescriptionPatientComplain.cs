using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class PrescriptionPatientComplain
    {
        public long Id { get; set; }
        public string Title { get; set; }

        public string Description { get; set; }
       

    }
}
