using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class SelectedSpecialityTag
    {
        public long Id { get; set; }
        public long SpecialityTagId { get; set; }
        public string SpecialityName { get; set; }

    }
}
