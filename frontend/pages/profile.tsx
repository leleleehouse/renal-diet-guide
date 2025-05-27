import React from 'react';
import { useRouter } from 'next/router';
import { usePatientStore, PatientInfo } from '../stores/usePatientStore';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export default function ProfileForm() {
  const router = useRouter();
  const { info, setInfo } = usePatientStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      const { checked } = e.target;
      if (name === 'diabetes' || name === 'hypertension') {
        setInfo({ comorbidities: { ...info.comorbidities, [name]: checked } });
      }
    } else {
      setInfo({ [name]: value });
    }
  };

  const validateNumber = (val: string | number): boolean => {
    const num = Number(val);
    return val !== '' && !isNaN(num) && num > 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: Array<keyof Pick<PatientInfo, 'age' | 'height' | 'weight'>> = ['age', 'height', 'weight'];
    const invalidFields = requiredFields.filter(field => !validateNumber(info[field]));

    if (invalidFields.length) {
      alert(`${invalidFields.join(', ')} 항목을 올바르게 입력해주세요.`);
      return;
    }

    setInfo({
      ...info,
      age: String(Number(info.age)),
      height: String(Number(info.height)),
      weight: String(Number(info.weight)),
    });

    router.push('/recommend');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg rounded-2xl shadow-lg bg-white">
        <CardHeader className="px-6 pt-8 text-center">
          <CardTitle className="text-2xl font-bold">👤 환자 정보 입력</CardTitle>
          <CardDescription className="text-gray-500">정확한 식단 추천을 위해 정보를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">나이</Label>
                <Input id="age" name="age" type="number" value={info.age} onChange={handleChange} placeholder="나이를 입력하세요" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="gender">성별</Label>
                <Select value={info.gender} onValueChange={(v) => setInfo({ gender: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F">여성</SelectItem>
                    <SelectItem value="M">남성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div />
            </div>

            <Separator />

            {/* Anthropometry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">키 (cm)</Label>
                <Input id="height" name="height" type="number" value={info.height} onChange={handleChange} placeholder="예: 170" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="weight">체중 (kg)</Label>
                <Input id="weight" name="weight" type="number" value={info.weight} onChange={handleChange} placeholder="예: 65" className="mt-1" />
              </div>
            </div>

            <Separator />

            {/* Dialysis Parameters */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="dialysisType">투석 종류</Label>
                <Select value={info.dialysisType} onValueChange={(v) => setInfo({ dialysisType: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HD">혈액투석</SelectItem>
                    <SelectItem value="PD">복막투석</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="urineOutput">잔뇨량</Label>
                <Select value={info.urineOutput} onValueChange={(v) => setInfo({ urineOutput: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">거의 없음</SelectItem>
                    <SelectItem value="some">조금 있음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Comorbidities */}
            <div>
              <Label className="block">동반질환</Label>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="diabetes" 
                    name="diabetes" 
                    checked={Boolean(info.comorbidities.diabetes)} 
                    onCheckedChange={(ch) => setInfo({ comorbidities: { ...info.comorbidities, diabetes: Boolean(ch) } })} 
                  />
                  <Label htmlFor="diabetes" className="ml-2">당뇨</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="hypertension" 
                    name="hypertension" 
                    checked={Boolean(info.comorbidities.hypertension)} 
                    onCheckedChange={(ch) => setInfo({ comorbidities: { ...info.comorbidities, hypertension: Boolean(ch) } })} 
                  />
                  <Label htmlFor="hypertension" className="ml-2">고혈압</Label>
                </div>
              </div>
            </div>

            <CardFooter className="pt-4">
              <Button type="submit" className="w-full">식단 추천 받기</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}