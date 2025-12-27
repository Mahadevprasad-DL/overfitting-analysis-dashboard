import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function parseCSV(csvText: string) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx];
      });
      data.push(row);
    }
  }
  
  return data;
}

function mapToStudentSchema(row: any) {
  return {
    gender: row.gender || row.Gender || '',
    race_ethnicity: row['race/ethnicity'] || row['race_ethnicity'] || row.race || '',
    parental_education: row['parental level of education'] || row['parental_education'] || row.parental_education || '',
    lunch: row.lunch || row.Lunch || '',
    test_preparation: row['test preparation course'] || row['test_preparation_course'] || row.test_preparation || '',
    math_score: parseInt(row['math score'] || row['math_score'] || row.math_score || '0'),
    reading_score: parseInt(row['reading score'] || row['reading_score'] || row.reading_score || '0'),
    writing_score: parseInt(row['writing score'] || row['writing_score'] || row.writing_score || '0'),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { csvData, clearExisting } = await req.json();

    if (!csvData) {
      throw new Error('No CSV data provided');
    }

    if (clearExisting) {
      await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const parsedData = parseCSV(csvData);
    const students = parsedData.map(mapToStudentSchema);

    const validStudents = students.filter(s => 
      s.gender && s.race_ethnicity && s.parental_education && 
      s.lunch && s.test_preparation &&
      s.math_score >= 0 && s.reading_score >= 0 && s.writing_score >= 0
    );

    if (validStudents.length === 0) {
      throw new Error('No valid student records found in CSV');
    }

    const { error: insertError } = await supabase
      .from('students')
      .insert(validStudents);

    if (insertError) throw insertError;

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully uploaded ${validStudents.length} student records`,
      count: validStudents.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});