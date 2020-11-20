using Microsoft.EntityFrameworkCore.Migrations;

namespace HospitalManagement.Migrations
{
    public partial class InvestigationTagAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Consulted",
                table: "DoctorAppointments",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "VisitingPrice",
                table: "DoctorAppointments",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Consulted",
                table: "DoctorAppointments");

            migrationBuilder.DropColumn(
                name: "VisitingPrice",
                table: "DoctorAppointments");
        }
    }
}
