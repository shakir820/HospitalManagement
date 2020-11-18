using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models.ViewModels
{
    public class ContactUsMessageModel
    {
        public long id { get; set; }
        public string customer_name { get; set; }
        public string mobile { get; set; }
        public string email { get; set; }
        public string message { get; set; }

    }
}
