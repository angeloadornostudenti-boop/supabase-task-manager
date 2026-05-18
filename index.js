const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path'); // Modulo nativo di Node per gestire i percorsi dei file
require('dotenv').config();

const app = express();
app.use(express.json());

// NUOVO: Diciamo a Express di rendere pubblica una cartella chiamata 'public'
// Qui dentro metteremo la nostra pagina web (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ROTTA 1: Leggere tutti i task (GET)
app.get('/tasks', async (req, res) => {
    const { data, error } = await supabase.from('tasks').select('*').order('id', { ascending: true });
    if (error) return res.status(400).json(error);
    res.json(data);
});

// ROTTA 2: Creare un nuovo task (POST)
app.post('/tasks', async (req, res) => {
    const { title } = req.body;
    const { data, error } = await supabase.from('tasks').insert([{ title }]).select();
    if (error) return res.status(400).json(error);
    res.status(201).json(data);
});

// NUOVO - ROTTA 3: Eliminare un task tramite ID (DELETE)
// Il ':id' nell'URL è una variabile (es. /tasks/5 eliminerà il task con id 5)
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params; // Preleva l'id dall'URL
    const { data, error } = await supabase.from('tasks').delete().eq('id', id).select();
    
    if (error) return res.status(400).json(error);
    res.json({ message: "Task eliminato con successo", data });
});

// NUOVO - ROTTA 4: Aggiornare lo stato di un task (PATCH)
app.patch('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { is_completed } = req.body; // Riceviamo il nuovo stato (true o false)

    const { data, error } = await supabase
        .from('tasks')
        .update({ is_completed: is_completed }) // Aggiorna la colonna
        .eq('id', id)
        .select();

    if (error) return res.status(400).json(error);
    res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server acceso sulla porta ${PORT}`));