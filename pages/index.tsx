import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import parse from "html-react-parser";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Primero de Primaria");
  const [generatedBios, setGeneratedBios] = useState<string>("");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    console.log(generatedBios);
  }, [generatedBios]);

  const prompt =
  "Estoy creando una aplicación que genera una serie de preguntas de evaluación para estudiantes de diferentes grados, como Primero de Primaria, Segundo de Primaria, etc. Cada nivel tiene su propio tema para generar las preguntas. Por favor, genera una serie de preguntas de evaluación que aumenten en complejidad y profundidad de acuerdo al nivel de grado del estudiante y al tema. El grado del estudiante es " +
  vibe +
  " y el tema es " +
  bio +
  `\n. Your response must be formatted using HTML Elements for easier readability, including paragraph tags, line breaks, headings and bold titles where applicable, no need to create Full HTML Page including head, title elements. Las preguntas deben abarcar los siguientes puntos:    
  1. Pregunta de comprensión básica.
  Proporcione una pregunta que evalúe la comprensión básica del tema.
  2. Pregunta de aplicación.
  Proporcione una pregunta que evalúe la capacidad del estudiante para aplicar el conocimiento adquirido.
  3. Pregunta de análisis.
  Proporcione una pregunta que evalúe la capacidad del estudiante para analizar el tema en profundidad.
  4. Pregunta de evaluación.
  Proporcione una pregunta que evalúe la capacidad del estudiante para evaluar y tomar decisiones basadas en su conocimiento del tema.
  5. Pregunta de creación.
  Proporcione una pregunta que evalúe la capacidad del estudiante para crear algo nuevo basado en su comprensión del tema.
  `;
  

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }
    scrollToBios();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>MagicPlan</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://samasat.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p></p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Genera tu planeación de Clase con Navi AI
        </h1>
        <p className="text-slate-500 mt-5">
          2,118 planeaciones generadas hasta ahora.
        </p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Escribe el tema para tu planeación de clase.{" "}
              <span className="text-slate-500"></span>
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={" por ejemplo. las celulas del cuerpo humano."}
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">
              Selecciona el Grado Escolar.
            </p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generar Planeación &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {/* {generatedBios && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={bioRef}
                >
                  Your generated bios
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedBios
                  .substring(generatedBios.indexOf("1") + 3)
                  .split("4.")
                  .map((generatedBio) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio);
                          toast("Bio copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={generatedBio}
                      >
                        <p>{generatedBio}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )} */}
          {parse(generatedBios)}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
