import ProjectList from './src/components/ProjectList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <ProjectList />
      </div>
    </main>
  );
}
