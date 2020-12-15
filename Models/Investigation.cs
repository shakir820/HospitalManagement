using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class InvestigationDoc
    {
        public long Id { get; set; }
        public long PrescriptionId { get; set; }
        public long InvestigationTagId { get; set; }
        public long DoctorId { get; set; }
        public long PatientId { get; set; }
        public long InvestigatorId { get; set; }
        public string Name { get; set; }
        public string Abbreviation { get; set; }
        public string FileLocation { get; set; }
        public string FileName { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime ModifiedDate { get; set; }
        public InvestigationStatus InvestigationStatus { get; set; } = InvestigationStatus.Pending;
    }



    public enum InvestigationStatus
    {
        Completed,
        Inprogress,
        Pending,
        Canceled
    }


    public class InvestigationTag
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Abbreviation { get; set; }
    }
}
