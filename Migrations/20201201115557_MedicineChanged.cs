using Microsoft.EntityFrameworkCore.Migrations;

namespace HospitalManagement.Migrations
{
    public partial class MedicineChanged : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BreakfastTime",
                table: "PrescriptionMedicines");

            migrationBuilder.DropColumn(
                name: "CustomSchedule",
                table: "PrescriptionMedicines");

            migrationBuilder.DropColumn(
                name: "DinnerTime",
                table: "PrescriptionMedicines");

            migrationBuilder.DropColumn(
                name: "LunchTime",
                table: "PrescriptionMedicines");

            migrationBuilder.DropColumn(
                name: "ThreeTimesAday",
                table: "PrescriptionMedicines");

            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "PrescriptionMedicines",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Schedule",
                table: "PrescriptionMedicines",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "PrescriptionMedicines");

            migrationBuilder.DropColumn(
                name: "Schedule",
                table: "PrescriptionMedicines");

            migrationBuilder.AddColumn<decimal>(
                name: "BreakfastTime",
                table: "PrescriptionMedicines",
                type: "decimal(2,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "CustomSchedule",
                table: "PrescriptionMedicines",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DinnerTime",
                table: "PrescriptionMedicines",
                type: "decimal(2,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "LunchTime",
                table: "PrescriptionMedicines",
                type: "decimal(2,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "ThreeTimesAday",
                table: "PrescriptionMedicines",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
