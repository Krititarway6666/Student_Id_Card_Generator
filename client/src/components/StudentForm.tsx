import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { StudentData } from '@/types';
import { HistoryIcon, UploadCloudIcon, XIcon, CheckIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  rollNumber: z.string().min(1, { message: 'Roll number is required' }),
  classGrade: z.string().min(1, { message: 'Class is required' }),
  division: z.string().min(1, { message: 'Division is required' }),
  allergies: z.array(z.string()).optional().default([]),
  rackNumber: z.string().optional(),
  busRoute: z.string().optional(),
  template: z.enum(['classic', 'modern']),
});

type FormValues = z.infer<typeof formSchema>;

interface StudentFormProps {
  onSubmit: (data: StudentData) => void;
  existingData: StudentData | null;
}

export default function StudentForm({ onSubmit, existingData }: StudentFormProps) {
  const { toast } = useToast();
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [restoreAvailable, setRestoreAvailable] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      rollNumber: '',
      classGrade: '',
      division: '',
      allergies: [],
      rackNumber: '',
      busRoute: '',
      template: 'classic',
    },
  });

  // Check localStorage for last saved form data
  useEffect(() => {
    const lastCard = localStorage.getItem('lastCard');
    setRestoreAvailable(!!lastCard);
  }, []);

  // Populate form with existing data if provided
  useEffect(() => {
    if (existingData) {
      form.reset({
        fullName: existingData.fullName,
        rollNumber: existingData.rollNumber,
        classGrade: existingData.classGrade,
        division: existingData.division,
        allergies: existingData.allergies,
        rackNumber: existingData.rackNumber || '',
        busRoute: existingData.busRoute || '',
        template: existingData.template,
      });
      setPhotoDataUrl(existingData.photo);
    }
  }, [existingData, form]);

  const saveCardMutation = useMutation({
    mutationFn: async (cardData: StudentData) => {
      const response = await apiRequest('POST', '/api/cards', cardData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotoDataUrl(e.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoDataUrl(null);
    const fileInput = document.getElementById('photoUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleRestoreForm = () => {
    const lastCard = localStorage.getItem('lastCard');
    if (lastCard) {
      try {
        const cardData = JSON.parse(lastCard) as StudentData;
        form.reset({
          fullName: cardData.fullName,
          rollNumber: cardData.rollNumber,
          classGrade: cardData.classGrade,
          division: cardData.division,
          allergies: cardData.allergies,
          rackNumber: cardData.rackNumber || '',
          busRoute: cardData.busRoute || '',
          template: cardData.template,
        });
        setPhotoDataUrl(cardData.photo);
        
        toast({
          title: "Form Restored",
          description: "Previous form data has been restored.",
        });
      } catch (error) {
        console.error('Error restoring form data:', error);
        toast({
          title: "Restore Failed",
          description: "Failed to restore previous form data.",
          variant: "destructive"
        });
      }
    }
  };

  const handleFormSubmit = (values: FormValues) => {
    if (!photoDataUrl) {
      toast({
        title: "Photo Required",
        description: "Please upload a student photo.",
        variant: "destructive"
      });
      return;
    }

    // Create student data object
    const studentData: StudentData = {
      ...values,
      photo: photoDataUrl,
      createdAt: new Date().toISOString(),
    };

    // Save last used form to localStorage
    localStorage.setItem('lastCard', JSON.stringify(studentData));
    setRestoreAvailable(true);

    // Call onSubmit with the form data
    onSubmit(studentData);

    // Save to API
    saveCardMutation.mutate(studentData);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Student Information</h2>
          {restoreAvailable && (
            <Button 
              variant="link" 
              className="text-sm text-blue-600 hover:text-blue-800 p-0"
              onClick={handleRestoreForm}
            >
              <HistoryIcon className="h-4 w-4 mr-1" /> Restore Last
            </Button>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">Basic Details</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rollNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll Number <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="ROL123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="classGrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class <span className="text-red-500">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={`Class ${i + 1}`}>
                              Class {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division <span className="text-red-500">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['A', 'B', 'C', 'D', 'E'].map((division) => (
                            <SelectItem key={division} value={division}>
                              {division}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">Additional Details</h3>
              
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <select 
                        multiple 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                        value={field.value}
                        onChange={(e) => {
                          const selectedOptions = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          );
                          field.onChange(selectedOptions);
                        }}
                      >
                        {['Nuts', 'Dairy', 'Eggs', 'Gluten', 'Seafood', 'Soy', 'Pollen', 'Dust', 'Latex', 'Insect Stings'].map((allergy) => (
                          <option key={allergy} value={allergy}>
                            {allergy}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Hold Ctrl/Cmd to select multiple options
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="rackNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rack Number</FormLabel>
                      <FormControl>
                        <Input placeholder="A123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="busRoute"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bus Route Number</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {Array.from({ length: 8 }, (_, i) => (
                            <SelectItem key={i + 1} value={`Route ${i + 1}`}>
                              Route {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormLabel>Student Photo <span className="text-red-500">*</span></FormLabel>
                <div className="flex items-start gap-4 mt-1">
                  <div className="flex-grow">
                    <label htmlFor="photoUpload" className="flex justify-center items-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                      <div className="space-y-1 text-center">
                        <div className="text-sm text-gray-600 flex flex-col items-center">
                          <UploadCloudIcon className="h-6 w-6 mb-2 text-gray-400" />
                          <span>Upload a photo</span>
                          <span className="text-xs text-gray-500">PNG, JPG, JPEG up to 2MB</span>
                        </div>
                      </div>
                      <input 
                        id="photoUpload" 
                        type="file" 
                        accept="image/*" 
                        className="sr-only" 
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                  
                  {photoDataUrl && (
                    <div>
                      <div className="w-32 h-40 rounded-md bg-gray-100 border border-gray-300 overflow-hidden">
                        <img src={photoDataUrl} alt="Photo preview" className="w-full h-full object-cover object-center" />
                      </div>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="mt-2 text-xs text-red-500 hover:text-red-700 p-0" 
                        onClick={handleRemovePhoto}
                      >
                        <XIcon className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ID Card Template Selection */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">ID Card Template</h3>
              
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        {/* Classic template */}
                        <div className="relative">
                          <RadioGroupItem value="classic" id="classic" className="sr-only peer" />
                          <Label
                            htmlFor="classic"
                            className="flex flex-col h-full p-2 text-gray-500 bg-white border border-gray-300 rounded-lg cursor-pointer peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 hover:bg-gray-50"
                          >
                            <div className="h-28 mb-2 bg-blue-800 rounded-t-md flex items-center justify-center">
                              <span className="text-white text-xs font-bold">CLASSIC TEMPLATE</span>
                            </div>
                            <div className="h-24 bg-white border border-gray-200 rounded-b-md flex items-center justify-center">
                              <span className="text-gray-500 text-xs">Traditional Style</span>
                            </div>
                          </Label>
                          {field.value === 'classic' && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                              <CheckIcon className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        
                        {/* Modern template */}
                        <div className="relative">
                          <RadioGroupItem value="modern" id="modern" className="sr-only peer" />
                          <Label
                            htmlFor="modern"
                            className="flex flex-col h-full p-2 text-gray-500 bg-white border border-gray-300 rounded-lg cursor-pointer peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 hover:bg-gray-50"
                          >
                            <div className="h-52 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-md flex items-center justify-center">
                              <span className="text-white text-xs font-medium">MODERN TEMPLATE</span>
                            </div>
                          </Label>
                          {field.value === 'modern' && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                              <CheckIcon className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between">
              <Button 
                type="reset" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setPhotoDataUrl(null);
                }}
              >
                Reset Form
              </Button>
              <Button 
                type="submit" 
                disabled={saveCardMutation.isPending}
              >
                Generate ID Card
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
