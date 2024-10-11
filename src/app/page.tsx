import { createClient } from '../../utils/supabase/server';

export default async function Home() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("transactions").select().limit(3);

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}