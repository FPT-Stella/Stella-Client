
import rootApi from "./rootApi";

export const getstatistics = async()=>{
    try{
        const response = await rootApi.get("/Dashboard/statistics");
        return response.data;
    } catch(error){
        console.error("Error fetching statistics", error);
        throw error;
    }
}

export const getBarChart = async()=>{
    try{
        const response = await rootApi.get("/Dashboard/statistics/students-by-major");
        return response.data;
    } catch(error){
        console.error("Error fetching BarChart", error);
        throw error;
    }
}