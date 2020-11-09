using HospitalManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.ViewModels
{
    public class SignInResult
    {
        public string error_msg { get; set; }
        public bool error { get; set; } = false;
        public bool success { get; set; } = false;
        public UserModel user { get; set; }
        public string msg { get; set; }
        public bool emailExist { get; set; } = true;
        public bool wrong_password { get; set; } = false;

    }



    public class UserCreateResult
    {
        public bool success { get; set; } = false;
        public long user_id { get; set; }
        public string user_name { get; set; }
        public string username { get; set; }
        public string user_gender { get; set; }
        public int user_age { get; set; }
        public bool approved { get; set; }
        public bool error { get; set; } = false;
        public string error_msg { get; set; }
        public IEnumerable<string> error_list { get; set; }
        public IEnumerable<string> role_list { get; set; }

    }
}
