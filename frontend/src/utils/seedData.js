import { teamService } from '../services';

const defaultTeam = [
    { name: 'Dr. Arun Kumar', role: 'Founder & CEO', image: null },
    { name: 'Sarah Lee', role: 'Head of Robotics', image: null },
    { name: 'Rahul Singh', role: 'AI Curriculum Lead', image: null },
    { name: 'Priya Patel', role: 'Operations Manager', image: null },
];

export const seedTeamData = async () => {
    try {
        const existing = await teamService.getAll();
        if (existing.length === 0) {
            console.log("Seeding default team data...");
            for (const member of defaultTeam) {
                await teamService.create(member);
            }
            console.log("Seeding complete.");
            return true;
        }
        return false;
    } catch (error) {
        console.error("Seeding failed", error);
        return false;
    }
};
