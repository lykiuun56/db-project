import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export function exportToExcel(rowData, fileName) {
  if (!rowData || rowData.length === 0) {
    alert("No data available to export!");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(rowData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Export");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAsExcelFile(excelBuffer, fileName);
}

function saveAsExcelFile(buffer, fileName) {
  const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
}
