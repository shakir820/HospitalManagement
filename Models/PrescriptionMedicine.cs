using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class PrescriptionMedicine
    {
        public long Id { get; set; }
        public long PatientId { get; set; }
        public long DoctorId { get; set; }
        public long MedicineId { get; set; }
        public long PrescriptionId { get; set; }
        public bool ThreeTimesAday { get; set; } = true;

        [Column(TypeName = "decimal(2,2)")]
        public decimal BreakfastTime { get; set; }
        
        [Column(TypeName = "decimal(2,2)")]
        public decimal LunchTime { get; set; }
        
        [Column(TypeName = "decimal(2,2)")]
        public decimal DinnerTime { get; set; }
        
        public string CustomSchedule { get; set; }
        public string Note { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

    }
}
