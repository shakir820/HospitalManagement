using Microsoft.EntityFrameworkCore.Migrations;

namespace HospitalManagement.Migrations
{
    public partial class bmdcCorrect : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BBMDC_certifcate",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "BMDC_certifcate",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BMDC_certifcate",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "BBMDC_certifcate",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
