"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios";
import { useEffect, useState } from "react"

export function ProvincePicker (
    { value, onValueChange, onCodeChange, ...props }: {
        value: string,
        onValueChange: (value: string) => void
        onCodeChange: (value: number) => void
    } & React.ComponentProps<typeof Select>
) {
    const [options, setOptions] = useState<ProvinceWardOption[]>([]);
    const [isBusy, setIsBusy] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsBusy(true);
        axios.get("https://provinces.open-api.vn/api/v2/p/").then(({data}) => {
            setOptions(data as ProvinceWardOption[]);
        }).catch().finally(() => {
            setIsBusy(false);
        })
    }, [])

    useEffect(() => {
        const currentOption = options.find(x => x.name == value);
        if (currentOption) onCodeChange(currentOption.code);
    }, [value, options])


    return (
        <Select value={value} onValueChange={onValueChange} disabled={props.disabled || isBusy}>
            <SelectTrigger>
                <SelectValue placeholder="Select province..." />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((x, i) => (
                        <SelectItem key={i} value={x.name}>
                            {x.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export type ProvinceWardOption = {
    name: string
    code: 1
    division_type: string
    codename: string
    phone_code: number
}

export function WardPicker (
    { value, onValueChange, provinceCode, ...props }: {
        value: string,
        onValueChange: (value: string) => void
        provinceCode: number,
    } & React.ComponentProps<typeof Select>
) {
    const [options, setOptions] = useState<ProvinceWardOption[]>([]);
    const [isBusy, setIsBusy] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsBusy(true);
        if (provinceCode < 0) return;
        axios.get(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`).then(({data}) => {
            const wards = data.wards as ProvinceWardOption[];
            setOptions(wards);
            if (wards.findIndex(x => x.name == value) < 0) onValueChange("");
        }).catch().finally(() => {
            setIsBusy(false);
        })
    }, [provinceCode])

    function handleValueChange(value: string) {
        if ((options.length && !value) || isBusy) return;
        onValueChange(value);
    }

    return (
        <Select value={value} onValueChange={handleValueChange} disabled={props.disabled || isBusy || provinceCode < 0}>
            <SelectTrigger>
                <SelectValue placeholder={"Select ward..."} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((x, i) => (
                        <SelectItem key={i} value={x.name}>
                            {x.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}