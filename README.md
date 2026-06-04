# 💦 Areya — Agua, Agua, Agua!

Juego interactivo de trivia con torres de agua en tiempo real.

## Rutas
| Ruta | Descripción |
|------|-------------|
| `/` | **Consola principal** — proyectar en pantalla grande |
| `/play` | **Pantalla del jugador** — cada participante en su celular |
| `/admin` | **Panel del host** — control del juego |

---

## Setup paso a paso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) → New Project
2. Copia la **Project URL** y la **anon public key**

### 3. Crear archivo .env
```bash
cp .env.example .env
```
Edita `.env` y pega tus credenciales:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
```

### 4. Crear las tablas en Supabase
1. Ve a **Supabase → SQL Editor → New Query**
2. Pega todo el contenido de `supabase-schema.sql`
3. Clic en **Run**

### 5. Correr en desarrollo
```bash
npm run dev
```

### 6. Deploy en Cloudflare Pages
```bash
npm run build
```
Luego en Cloudflare Pages:
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Variables de entorno: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

---

## Cómo jugar
1. Host abre `/admin` → **Nueva Sesión**
2. Proyectar `/?session=ID` en la pantalla grande
3. Participantes abren `/play?session=ID` en su celular y registran su nombre
4. Host presiona **▶ Iniciar Juego**
5. Todos responden al mismo tiempo — el más rápido en acertar sube más agua
6. Host avanza pregunta a pregunta
7. Primero en llenar la torre gana 🏆

---

## Personalizar preguntas
Edita `src/data/questions.js`

```js
{
  q: "¿Tu pregunta aquí?",
  opts: ["Opción A", "Opción B", "Opción C", "Opción D"],
  c: 1,        // índice de la respuesta correcta (0-3)
  note: "Nota explicativa opcional",
  tf: false    // true = verdadero/falso (solo muestra A y B)
}
```
