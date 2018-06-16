package cs.model.project;

import org.apache.poi.ss.usermodel.Row;

import java.util.ArrayList;
import java.util.List;

public class UpdateDisbursedResultVO {

    private int totalCount;
    private int successCount;
    private List<ErrorRowInfo> errorRowInfos;

    public UpdateDisbursedResultVO(int totalCount, int successCount, List<Object[]> rows) {
        this.totalCount = totalCount;
        this.successCount = successCount;
        this.errorRowInfos = new ArrayList<>();
        for (Object[] row : rows) {
            errorRowInfos.add(new ErrorRowInfo((Row) row[0], (String) row[1]));
        }
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public int getSuccessCount() {
        return successCount;
    }

    public void setSuccessCount(int successCount) {
        this.successCount = successCount;
    }

    public List<ErrorRowInfo> getErrorRowInfos() {
        return errorRowInfos;
    }

    public void setErrorRowInfos(List<ErrorRowInfo> errorRowInfos) {
        this.errorRowInfos = errorRowInfos;
    }
}

class ErrorRowInfo {
    private int rowNumber;
    private String projectName;
    private String projectNumber;
    private String errorMessage;

    public ErrorRowInfo(Row row, String msg) {
        this.rowNumber = row.getRowNum() + 1;
        this.projectName = row.getCell(1).getStringCellValue();
        this.projectNumber = row.getCell(5).getStringCellValue();
        this.errorMessage = msg;
    }

    public int getRowNumber() {
        return rowNumber;
    }

    public void setRowNumber(int rowNumber) {
        this.rowNumber = rowNumber;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectNumber() {
        return projectNumber;
    }

    public void setProjectNumber(String projectNumber) {
        this.projectNumber = projectNumber;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
