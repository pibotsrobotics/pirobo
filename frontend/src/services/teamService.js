import BaseService from './baseService';

class TeamService extends BaseService {
    constructor() {
        super('team');
    }

    // You can add specialized methods here if needed, 
    // but BaseService already covers getAll, create, update, delete.
}

export const teamService = new TeamService();
