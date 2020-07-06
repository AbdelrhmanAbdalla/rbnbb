import Helpers from "../helpers/Helpers";
import data from "../data/data.json";

const baseUrl = "https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-";
const newData = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=airbnb-listings&q=&lang=fr&rows=20&facet=city&facet=country&facet=property_type&facet=room_type&facet=bed_type&facet=amenities&timezone=Europe%2FParis";


class EventsService{

    /**
     * Liste des events
     *
     * @param rows
     * @returns {Promise<*>}
     */
    static async list(){
        let init = {method: "GET"};
        let call = await fetch(`${newData}`, init);
        let response = await call.json();
        return response.records;
    }

    static async getEventsThisWeek(rows = 20){
        let init = {method: "GET"};

        let q = `date_start>=${Helpers.getActualDate()} AND date_end<=${Helpers.getEndOfWeek()}`;
        let sort = 'date_start';

        let call = await fetch(`${baseUrl}&rows=${rows}&q=${q}&sort=-${sort}`, init);
        let response = await call.json();
        return response.records;
    }

    static async getEventsAfter(rows = 20){
        let init = {method: "GET"};

        let q = `date_start > ${Helpers.getEndOfWeek()}`;
        let sort = 'date_start';

        let call = await fetch(`${baseUrl}&rows=${rows}&q=${q}&sort=-${sort}`, init);
        let response = await call.json();
        return response.records;
    }

    static async getEventsByName(rows, title){
        let init = {method: "GET"};

        let q = `title=${title} AND date_start >= ${Helpers.getActualDate()}`;
        let sort = 'date_start';

        let call = await fetch(`${baseUrl}&rows=${rows}&q=${q}&sort=-${sort}`, init);
        let response = await call.json();
        return response.records;
    }




}

export default EventsService;
