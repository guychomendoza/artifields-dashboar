import { BACKEND_URL } from "./api-url";

import type { Project, ProjectAnalysis } from "./type";

export const fetchProjects = async (userId: number): Promise<Project[]> => {

    try {
        const response = await fetch(`${BACKEND_URL}/api/projects/user/${userId}`);
        if (!response.ok) {
            return [];
        }
        const data: Project[] = await response.json();
        return data;
    } catch (error) {
        return [];
    }

}

export const fetchProjectAnalysis = async (projectId: number): Promise<ProjectAnalysis|null> => {

    try {
        const response = await fetch(`${BACKEND_URL}/api/projects/${projectId}`);
        if (!response.ok) {
            return null;
        }
        const data: ProjectAnalysis = await response.json();
        return data;
    } catch (error) {
        return null;
    }

}