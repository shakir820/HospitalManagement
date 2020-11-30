using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models.ViewModels
{
    public class MedicineModel
    {
        public long id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string medicine_link { get; set; }
    }
}
