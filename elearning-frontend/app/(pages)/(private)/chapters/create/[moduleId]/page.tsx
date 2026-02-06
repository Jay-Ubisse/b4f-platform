"use client";

import "./editor.css";
import "./editor-content.css";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { use, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Upload,
} from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { sanitizeFilename } from "@/lib/sanitize-filename";
import { supabase } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import { createChapter } from "@/services/chapter";
import { useAuth } from "@/contexts/auth-context";

const lowlight = createLowlight(common);

export default function CreateChapter({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = use(params);

  const [htmlOutput, setHtmlOutput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log(htmlOutput);
  const [name, setName] = useState<string | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const textValue = e.target.value;
    setName(textValue);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setHtmlOutput(editor.getHTML());
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    const fileName = sanitizeFilename(file.name);
    const filePath = `chapters-images/${Date.now()}_${fileName}`;

    editor
      .chain()
      .focus()
      .setImage({ src: "/spinner.gif", alt: "Carregando imagem..." }) // imagem de loading temporária
      .run();

    const { error } = await supabase.storage
      .from("pu-e-learning")
      .upload(filePath, file);

    if (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao fazer upload da imagem");
      return;
    }

    const { data: fileData } = supabase.storage
      .from("pu-e-learning")
      .getPublicUrl(filePath);

    const publicUrl = fileData?.publicUrl;

    if (publicUrl) {
      // Remove o placeholder anterior (opcional)
      editor.commands.deleteSelection(); // remove imagem temporária
      // Insere a imagem final
      editor.chain().focus().setImage({ src: publicUrl }).run();
    } else {
      toast.error("Erro ao obter URL da imagem");
    }
  };

  const handleSave = async () => {
    toast.loading("A processar...", { id: "1" });

    if (!videoFile || !name || !editor) {
      toast.error("Preencha todos os campos.", { id: "1" });
      return;
    }

    try {
      const fileName = sanitizeFilename(videoFile.name);
      const filePath = `chapters-videos/${Date.now()}_${fileName}`;

      toast.loading("A carregar vídeo...", { id: "1" });

      const { error } = await supabase.storage
        .from("pu-e-learning")
        .upload(filePath, videoFile);

      if (error) {
        console.error("Erro no upload:", error);
        toast.error("Erro ao fazer upload do vídeo");
        return;
      }

      const { data: fileData } = supabase.storage
        .from("pu-e-learning")
        .getPublicUrl(filePath);

      toast.loading("A publicar capítulo...", { id: "1" });

      const videoUrl = fileData.publicUrl;
      const content = editor.getHTML();

      const response = await createChapter({
        data: {
          content,
          createdById: user?.id,
          moduleId,
          name,
          videoUrl,
        },
      });

      if (response.status === 201) {
        toast.success("Capítulo publicado com sucesso", { id: "1" });
        router.push(`/chapters/${response.data.chapter.id}`);
      } else {
        toast.error("Ocorreu um erro ao publicar do capítulo", {
          id: "1",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao publicar do capítulo", {
        id: "1",
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-5">
      {/* Editor */}

      <div className="w-full lg:w-2/3 space-y-4">
        <h1 className="text-2xl font-semibold">Publicar Novo Capítulo</h1>
        <div className="space-y-2">
          <Label>Nome do capítulo</Label>
          <Input type="text" onChange={handleNameChange} />
        </div>
        <div className="space-y-2">
          <Label>Vídeo introdutório</Label>
          <Input type="file" accept="video/mp4" onChange={handleVideoChange} />
        </div>
        <div className="flex flex-wrap gap-2 mt-10 mb-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive("bold") ? "bg-primary text-white" : ""}
          >
            <Bold size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={
              editor?.isActive("italic") ? "bg-primary text-white" : ""
            }
          >
            <Italic size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor?.isActive("heading", { level: 1 })
                ? "bg-primary text-white"
                : ""
            }
          >
            <Heading1 size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor?.isActive("heading", { level: 2 })
                ? "bg-primary text-white"
                : ""
            }
          >
            <Heading2 size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor?.isActive("heading", { level: 3 })
                ? "bg-primary text-white"
                : ""
            }
          >
            <Heading3 size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={
              editor?.isActive("bulletList") ? "bg-primary text-white" : ""
            }
          >
            <List size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={
              editor?.isActive("orderedList") ? "bg-primary text-white" : ""
            }
          >
            <ListOrdered size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className={
              editor?.isActive("codeBlock") ? "bg-primary text-white" : ""
            }
          >
            <Code2 size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={
              editor?.isActive("blockquote") ? "bg-primary text-white" : ""
            }
          >
            <Quote size={16} />
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} />
          </Button>
        </div>

        <EditorContent editor={editor} className="tiptap-editor" />

        <Button
          onClick={handleSave}
          className="bg-primary text-white block ml-auto"
        >
          Guardar
        </Button>
      </div>

      {/* Preview */}
      <div className="w-full lg:w-1/3 space-y-6 border-t-2 border-slate-200 pt-5 lg:pt-0 lg:border-t-0">
        {videoUrl && (
          <div className="rounded-md overflow-hidden border p-4">
            <h1 className="text-2xl font-semibold mb-4">
              Pré-visualização do vídeo
            </h1>
            <video
              controls
              src={videoUrl}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
