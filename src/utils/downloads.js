import { commonApi } from "../common/common";

export const downloadPDF = async ({ startDate, endDate }) => {

    try {

        let endpoint = `api/order/export/pdf`;

        const format = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        if (startDate && endDate) {
            endpoint += `?startDate=${format(startDate)}&endDate=${format(endDate)}`;
        }

        const response = await commonApi({
            method: "GET",
            endpoint,
            responseType: "blob"  
        });

        const blob = new Blob([response.data], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "orders.pdf";

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("PDF download failed", error);
    }
};


export const downloadExcel = async ({ startDate, endDate }) => {

    try {

        let endpoint = `api/order/export/excel`;

        const format = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        if (startDate && endDate) {
            endpoint += `?startDate=${format(startDate)}&endDate=${format(endDate)}`;
        }

        const response = await commonApi({
            method: "GET",
            endpoint,
            responseType: "blob"
        });

        const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "orders.xlsx";

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Excel download failed", error);
    }
};