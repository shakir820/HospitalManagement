using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class Medicine
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string MedicineLink { get; set; }
    }
}
