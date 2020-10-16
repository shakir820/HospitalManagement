using HospitalManagement.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.ViewModels
{
    public class ErrorResult<T> : IErrorrResult<T> where T : class
    {
        public bool error { get; set; }
        public string error_msg { get; set; }
        public T error_type { get; set; }

    }
}
