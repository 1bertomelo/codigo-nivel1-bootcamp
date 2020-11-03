const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

const arrayProjects = [];

/*exemplo 1 middleware */

function logRequests(request, response, next) {
    const { method, url } = request;
    const logLabel = `[${method.toUpperCase()}] ${url}`;
    console.log(logLabel);
    return next();
}

/*exemplo 2 middleware */

function validateUuid(request, response, next) {
    const { id } = request.params;
    if (!isUuid(id)) {
        return response.status(400).json({ "error": "Invalid project id" });
    }
    return next();
}

//chamando middlewares
app.use(logRequests);
app.use('/projects/:id', validateUuid);


app.get('/projects', (request, response) => {
    const { title } = request.query;
    console.log(title);
    const projetcsResults = title
        ? arrayProjects.filter(project => project.title.includes(title))
        : arrayProjects;
    return response.json(projetcsResults);
});


app.post('/projects', (request, response) => {
    console.log(request.body);
    const { title, owner } = request.body;
    const newProject = { id: uuid(), title, owner };
    arrayProjects.push(newProject);
    return response.json(newProject);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;
    const projectIndex = arrayProjects.findIndex(project => project.id = id);
    if (projectIndex < 0) {

        return response.status(404).json({ "error": "Project not found" });
    }

    const updatedProject = {
        id,
        title,
        owner
    };

    arrayProjects[projectIndex] = updatedProject;
    return response.json(updatedProject);

});


app.delete('projects/:id', (request, response) => {
    const { id } = request.params;
    console.log(id);
    const projectIndex = arrayProjects.findIndex(project => project.id = id);
    console.log(projectIndex);
    if (projectIndex < 0) {

        return response.status(404).json({ "error": "Project not found" });
    }

    arrayProjects.splice(projectIndex, 1);

    return response.status(204).send();
});

app.listen(3333, () => {
    console.log('😁 Back-end started!');
});