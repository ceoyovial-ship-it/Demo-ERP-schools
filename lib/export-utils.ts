// ============================================================
// Yovial School ERP — Global Export Utilities
// Client-side PDF/Excel/CSV/Print generation using browser APIs
// ============================================================

export interface ExportColumn {
  key: string;
  label: string;
}

function escapeCSV(value: unknown): string {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCSV(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string
): void {
  const header = columns.map((c) => escapeCSV(c.label)).join(',');
  const rows = data.map((row) =>
    columns.map((c) => escapeCSV(row[c.key])).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportToExcel(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string
): void {
  const headerRow = columns
    .map((c) => `<Cell ss:StyleID="HeaderCell"><Data ss:Type="String">${escapeXml(c.label)}</Data></Cell>`)
    .join('');

  const dataRows = data
    .map((row) => {
      const cells = columns
        .map((c) => {
          const val = row[c.key];
          const isNum = typeof val === 'number' && !isNaN(val);
          const cellStyle = isNum ? 'DataCellNum' : 'DataCell';
          return `<Cell ss:StyleID="${cellStyle}"><Data ss:Type="${isNum ? 'Number' : 'String'}">${escapeXml(val ?? '')}</Data></Cell>`;
        })
        .join('');
      return `<Row>${cells}</Row>`;
    })
    .join('');

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="HeaderCell">
   <Font ss:Bold="1" ss:Size="11" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#4F46E5" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
  </Style>
  <Style ss:ID="DataCell">
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="DataCellNum">
   <NumberFormat ss:Format="General"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Export">
  <Table>
   <Row>${headerRow}</Row>
   ${dataRows}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  downloadBlob(blob, `${filename}.xls`);
}

export function exportToPDF(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string,
  title?: string
): void {
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) return;

  const headerCells = columns
    .map((c) => `<th>${escapeHtml(c.label)}</th>`)
    .join('');

  const bodyRows = data
    .map(
      (row) =>
        `<tr>${columns
          .map((c) => `<td>${escapeHtml(row[c.key] ?? '')}</td>`)
          .join('')}</tr>`
    )
    .join('');

  const reportTitle = title || filename;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(reportTitle)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 32px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 2px solid #4F46E5; padding-bottom: 16px; }
  .school-name { font-size: 22px; font-weight: 700; color: #4F46E5; }
  .school-sub { font-size: 13px; color: #6b7280; margin-top: 2px; }
  .meta { text-align: right; font-size: 12px; color: #6b7280; }
  .report-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .report-info { font-size: 12px; color: #6b7280; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  thead th { background: #4F46E5; color: white; padding: 10px 12px; text-align: left; font-weight: 600; white-space: nowrap; }
  tbody td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; white-space: nowrap; }
  tbody tr:nth-child(even) { background: #f9fafb; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
  .row-count { display: inline-block; background: #eef2ff; color: #4F46E5; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-left: 8px; }
  @media print { body { padding: 16px; } .no-print { display: none; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="school-name">Yovial International School</div>
      <div class="school-sub">CBSE Affiliated · Bengaluru</div>
    </div>
    <div class="meta">
      <div>Generated: ${dateStr}</div>
      <div>Yovial School ERP</div>
    </div>
  </div>
  <div class="report-title">${escapeHtml(reportTitle)} <span class="row-count">${data.length} records</span></div>
  <div class="report-info">Date: ${dateStr}</div>
  <table>
    <thead><tr>${headerCells}</tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>
  <div class="footer">
    This document was generated by Yovial School ERP on ${dateStr}<br/>
    Confidential — For internal use only
  </div>
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 300); };
  </script>
</body>
</html>`);
  win.document.close();
}

export function printData(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  title?: string
): void {
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) return;

  const rows = data
    .map(
      (row) =>
        `<tr>${columns
          .map((c) => `<td>${escapeHtml(row[c.key] ?? '')}</td>`)
          .join('')}</tr>`
    )
    .join('');

  const reportTitle = title || 'Export';
  const dateStr = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(reportTitle)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; padding: 28px; }
  .header { margin-bottom: 18px; padding-bottom: 12px; border-bottom: 2px solid #4F46E5; }
  .title { font-size: 20px; font-weight: 700; color: #4F46E5; margin-bottom: 4px; }
  .meta { font-size: 12px; color: #6b7280; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 12px; }
  thead th { background: #4F46E5; color: #fff; padding: 10px 12px; text-align: left; font-weight: 700; }
  tbody td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; white-space: nowrap; }
  tbody tr:nth-child(even) { background: #f9fafb; }
  .footer { margin-top: 18px; font-size: 11px; color: #6b7280; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">${escapeHtml(reportTitle)}</div>
    <div class="meta">Generated on ${dateStr}</div>
  </div>
  <table>
    <thead>
      <tr>${columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join('')}</tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Confidential — For internal use only</div>
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 200); };
  </script>
</body>
</html>`);
  win.document.close();
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

function escapeXml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'print';

export function exportData(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string,
  format: ExportFormat,
  title?: string
): void {
  switch (format) {
    case 'csv':
      exportToCSV(data, columns, filename);
      break;
    case 'excel':
      exportToExcel(data, columns, filename);
      break;
    case 'pdf':
      exportToPDF(data, columns, filename, title);
      break;
    case 'print':
      printData(data, columns, title);
      break;
  }
}
