import axios from 'axios';

export async function deleteRecord(apiUrl, id) {
  try {
    await axios.delete(`${apiUrl}/delete/${id}`);
    console.log(`Record with ID ${id} deleted successfully.`);
    return true; // Indicate success
  } catch (error) {
    console.error(`Error deleting record with ID ${id}:`, error);
    return false; // Indicate failure
  }
}

export function removeRecordFromGrid(gridApi, idField, id) {
  const rowNode = gridApi.getRowNode(id.toString());
  if (rowNode) {
    gridApi.applyTransaction({ remove: [rowNode.data] });
    console.log(`Record with ID ${id} removed from the grid.`);
  } else {
    console.error(`Row with ID ${id} not found in the grid.`);
  }
}
