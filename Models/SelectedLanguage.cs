using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class SelectedLanguage
    {
        public long Id { get; set; }
        public long LanguageId { get; set; }
        public string LanguageName { get; set; }
    }
}
