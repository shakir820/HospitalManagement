using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models.ViewModels
{
    public class PrescriptionMedicineModel
    {
        public long id { get; set; }
        public long patient_id { get; set; }
        public long doctor_id { get; set; }
        public long medicine_id { get; set; }
        public long prescription_id { get; set; }
        public string title { get; set; }
        public string schedule { get; set; }
        public string duration { get; set; }
        public string note { get; set; }
    }
}
